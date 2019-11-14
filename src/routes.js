// import da classe Router do express
import { Router } from 'express';

// import do controller do utilizador e da session
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
// import do middleware da autenticação
import authMiddleware from './app/middleware/auth';
// instancia da classe Router
const routes = new Router();

// rota para criar um utilizador
routes.post('/users', UserController.store);

// rota para autenticação
routes.post('/sessions', SessionController.store);

// definir como middlware global
// terá efeito somente para as rotas abaixo visto que foi declarado depois das
// duas rotas em cima
routes.use(authMiddleware);

// rota para atualizar um utilizador
routes.put('/users', UserController.update);


// export do routes
export default routes;
