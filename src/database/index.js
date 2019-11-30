import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

import databaseConfig from '../config/database';

/* array com todos os models */
const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    /* percorrer o array dos models e envia a conexao para cada modelo */
    models
      .map((model) => model.init(this.connection))
      /* percorrer o array dos models e chamar o metodo associate caso existir */
      .map((model) => model.associate && model.associate(this.connection.models));
  }

  /* configuração da conexão do mongo */
  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/gobarber',
      { useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true },
    );
  }
}

export default new Database();
