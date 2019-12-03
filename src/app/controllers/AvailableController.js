import {
  startOfDay, endOfDay, setHours, setMinutes, setSeconds, format, isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

class AvailableController {
  /* listar todos os horários disponiveis */
  async index(req, res) {
    /* pegar o campo date */
    const { date } = req.query;
    /* caso não tiver o date retorna erro */
    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    /* transformar a data num inteiro */
    const searchDate = Number(date);

    /* filtro na db para pegar todos os horarios vagos do provider nesta data
     * incluido os cancelados, a partir do horario enviado até o final */
    const appointment = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: { [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)] },
      },
    });

    /* todos os horarios que o provider possui */
    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
    ];

    /* pegar cada horario e verificar se não é um horario que já passou e
     * e se não está ocupado */
    const available = schedule.map((time) => {
      /* pegar hora e minuto */
      const [hour, minute] = time.split(':');
      /* converter para este formato 2019-06-23 08:00:00 */
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute), 0,
      );

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available: isAfter(value, new Date()) // horarios depois de agora
        && !appointment.find((a) => format(a.date, 'HH:mm') === time), // ver se o horario não está agendado
      };
    });

    return res.json(available);
  }
}

export default new AvailableController();
