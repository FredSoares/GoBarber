import express from 'express';
import path from 'path';
import routes from './routes';

import './database';

class App {
  // metodo que será chamado na inicialização da classe
  // possui todas as configurações necessarias
  constructor() {
    this.server = express();
    // inicialização dos metodos
    this.middleware();
    this.routes();
  }

  middleware() {
    // config para receber requisicoes no formato JSON
    this.server.use(express.json());
    // permissão para servir arquivos estaticos
    this.server.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')));
  }

  routes() {
    // utiliza rotas do arquivo routes
    this.server.use(routes);
  }
}
// export da classe para que possa ser utilizada por outras classes
// OBS: App().server porque é a unica coisa que será utilizado foi passado diretamente
module.exports = new App().server;
