import User from '../models/User';
import File from '../models/File';

class ProviderController {
  /* metodo que retorna todas os providers */
  async index(req, res) {
    const providers = await User.findAll({
      where: { provider: true },
      /* o attributes especificas os campos a serem retornados */
      attributes: ['id', 'name', 'email', 'avatar_id'],
      /* representa o relacionamente com a tabel avatar */
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(providers);
  }
}

export default new ProviderController();
