import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    // pegar o email e o password no body da requisição
    const { email, password } = req.body;

    // verifica se existe o utilizador
    const user = await User.findOne({ where: { email } });

    // caso o utilizador não existir
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    // verificar password
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    // caso tudo estiver correcto
    const { id, name } = user;
    return res.json({
      user: {
        id,
        name,
        email,
      },
      // token gerado com o id user, uma string secreta e durançao 7 dias (7d)
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
