import Sequelize from 'sequelize';

import User from '../app/models/User';

import databaseConfig from '../config/database';

// array com todos os models
const models = [User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    // percorrer o array dos models e enviar a conexao para cada modelo
    models.map((model) => model.init(this.connection));
  }
}

export default new Database();
