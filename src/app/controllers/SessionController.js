import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    // schema dos dados da requisição utilizando o Yup
    const schema = Yup.object().shape(
      {
        email: Yup.string().email().required(),
        password: Yup.string().required(),
      },
    );

    // verificar se o schema está valido
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // pegar o email e o password no body da requisição
    const { email, password } = req.body;

    // verifica se existe o utilizador
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    // caso o utilizador não existir
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    // verificar password
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    // caso tudo estiver correcto
    const { id, name, avatar } = user;
    return res.json({
      user: {
        id,
        name,
        email,
        avatar,
      },
      // token gerado com o id user, uma string secreta e durançao 7 dias (7d)
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
