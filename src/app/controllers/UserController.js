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
    // pegar o email e o password antigo no corpo da função
    const { email, oldPassword } = req.body;

    // selecionar o user elo ID
    const user = await User.findByPk(req.userId);

    // verificar se o email é diferente da requisição para saber se é para atualizar
    if (email !== user.email) {
      // vericar se o novo email já existe
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(401).json({ error: 'User already exists.' });
      }
    }

    // caso o email não existir ainda validadar a password
    // verifica se foi enviado o oldPassword e se o mesmo está correto
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    // atualizar e pegar id, name e provider
    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
