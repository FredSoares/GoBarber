// import da classe Router do express
import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

// import dos controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';

// import do middleware da autenticação
import authMiddleware from './app/middlewares/auth';
// instancia da classe Router
const routes = new Router();
const upload = multer(multerConfig);

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

// rota para todos os prestadores de serviços
routes.get('/providers', ProviderController.index);
// rota ver todos os horarios dos prestadores de serviços
routes.get('/providers/:providerId/available', AvailableController.index);

// rota para agendamento de serviços
routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/schedule', ScheduleController.index);

/* rota para noticações */
routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.post('/files', upload.single('file'), FileController.store);


// export do routes
export default routes;
