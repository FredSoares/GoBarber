import jwt from 'jsonwebtoken';
// função que transforma umfunção de callback em uma função async await
import { promisify } from 'util';

import authConfig from '../../config/auth';


export default async (req, res, next) => {
  // pega o token da autenticação no header da requisição
  const authHeader = req.headers.authorization;

  // verficar se o token foi enviado
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  /* pegar o token utilizando a desestrututazação porque
  o array está no seguinte formato Array [Bearer, token] */
  const [, token] = authHeader.split(' ');
  console.log(token);
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // incluir o id do user na requisição para caso for necessario atualizar o
    // utilizador com o id no UserController
    req.userId = decoded.id;
    return next();
  } catch (error) {
    // se retornarr erro isto quer dizer que o token é invalido
    return res.status(401).json({ error: 'Token invalid' });
  }
};
