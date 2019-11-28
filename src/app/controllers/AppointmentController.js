import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import Appointment from '../models/Appointment';
import User from '../models/User';

class AppointmentControler {
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

    const appointment = await Appointment.create({
      user_id: req.user_id,
      provider_id,
      date,
    });
    return res.json(appointment);
  }
}

export default new AppointmentControler();
