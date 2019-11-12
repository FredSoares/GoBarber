// import da classe Router do express
import { Router } from 'express';

// import do controller do utilizador
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
// instancia da classe Router
const routes = new Router();

// rota para criar um utilizador
routes.post('/users', UserController.store);

// rota para autenticação
routes.post('/sessions', SessionController.store);

// export do routes
export default routes;
