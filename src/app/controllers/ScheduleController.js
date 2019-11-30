import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController {
  async index(req, res) {
    /* Verificar se o utilizar é um prestador de serviço */
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    /* caso não for um prestador de serviço retorna erro */
    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider' });
    }

    /* pegar a data passado na query parametro */
    const { date } = req.query;
    const parsedDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
    });

    return res.json(appointments);
  }
}
export default new ScheduleController();
