import 'dotenv/config';

import express from 'express';
import path from 'path';
import cors from 'cors';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import sentryConfig from './config/sentry';
import routes from './routes';

import 'express-async-errors';

import './database';

class App {
  // metodo que será chamado na inicialização da classe
  // possui todas as configurações necessarias
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);
    // inicialização dos metodos
    this.middleware();
    this.routes();

    this.exceptionHandler();
  }

  middleware() {
    // The request handler must be the first middleware on the app
    this.server.use(Sentry.Handlers.requestHandler());
    // add cors
    this.server.use(cors());
    // config para receber requisicoes no formato JSON
    this.server.use(express.json());
    // permissão para servir arquivos estaticos
    this.server.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')));
  }

  routes() {
    // utiliza rotas do arquivo routes
    this.server.use(routes);

    // The error handler must be before any other error middleware and after all controllers
    this.server.use(Sentry.Handlers.errorHandler());
  }

  /* middleware para tratamento de error */
  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }
      return res.status(500).json({ error: 'internal server error' });
    });
  }
}
// export da classe para que possa ser utilizada por outras classes
// OBS: App().server porque é a unica coisa que será utilizado foi passado diretamente
module.exports = new App().server;
