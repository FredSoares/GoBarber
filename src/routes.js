// import da classe Router do express
import { Router } from 'express';

// import do controller do utilizador
import UserController from './app/controllers/UserController';
// instancia da classe Router
const routes = new Router();

// rota para criar um utilizador
routes.post('/users', UserController.store);

// export do routes
export default routes;
