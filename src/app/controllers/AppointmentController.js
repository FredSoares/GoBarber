import * as Yup from 'yup';
import {
  startOfHour, parseISO, isBefore, format, subHours,
} from 'date-fns';
import pt from 'date-fns/locale/pt';

import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class AppointmentControler {
  /* Listar todos os agendamantos */
  async index(req, res) {
    /* quantidade de items a ser enviado inicialmente é 1 */
    const { page = 1 } = req.query;
    /* pesquisa na db */
    const appointment = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });
    return res.json(appointment);
  }

  /* criar um agendamento */
  async store(req, res) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      provider_id: Yup.number().required(),
    });

    // validação do schema da requisição
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    // Check if provider_id is a provider
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers.' });
    }

    /* tranforma a data enviada num objeto Date do JS */
    const hourStart = startOfHour(parseISO(date));

    /* verifica se a data que foi enviada está antes da data atual */
    /* caso estiver quer dizer que a data já passou */
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past date are not permitted' });
    }

    /* verificar se a data está disponiviel */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    /* se a data não estiver disponivel retornar erro */
    if (checkAvailability) {
      return res.status(400).json({ error: 'Appointment date is not availability' });
    }

    /* registrar na db */
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    /* Notificar prestador de serviço */
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', ás' H:mm'h'",
      { locale: pt },
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  /* cancelar um agendamento */
  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    /* verifiacar se  existe a marcação */
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found ' });
    }

    /* verifiacar se o id do user que fez a marcação é igual ao da requisição */
    if (appointment.user_id !== req.userId) {
      return res.status(401).json({ error: "You don't have permission to cancel this appointment. " });
    }

    /* verificar hora de cancelamento só pode se estiver 2h antes do agendado */
    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel appointments 2 hours in advance.',
      });
    }

    /* colocar data do cancelamento no campo canceled_at */
    appointment.canceled_at = new Date();
    /* salvar alteração */
    await appointment.save();

    /* enviar email de alerta de cancelamento */
    await Queue.add(CancellationMail.key, {
      appointment,
    });

    return res.json(appointment);
  }
}

export default new AppointmentControler();
