import User from '../models/User';

class UserController {
  // função que recebe os dados da requisição e faz a criação do utilizador na DB
  async store(req, res) {
    // verificar se já existe um utilizador com o mesmo email resistrado
    const userExists = await User.findOne({ where: { email: req.body.email } });

    // caso existir retorna erro com o status 400
    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }
    // registrar e pegar só os dados necessario para o retorno da resposta
    const {
      id, name, email, provider,
    } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  // recebe os dados da requisição e faz a atualização dado do utilizador
  async update(req, res) {
    console.log(req.userId);

    return res.json({ ok: true });
  }
}

export default new UserController();
