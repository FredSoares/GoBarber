import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    /* verificar se o utilizador é um provider */
    const checkIsProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });
    /* cao não for um provider retornar erro */
    if (!checkIsProvider) {
      return res.status(401).json({ error: 'Only provider can load notifications' });
    }

    /* selecionando as notificações ordenadas pela data e limite de 20 */
    const notifications = await Notification.find({
      user: req.userId,
    }).sort({ createdAt: 'desc' }).limit(20);

    return res.json(notifications);
  }
}

export default new NotificationController();
