import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.VIRTUAL, // VIRTUAL valor que ñ será guardado na DB
      password_hash: Sequelize.STRING,
      provider: Sequelize.BOOLEAN,
    },
    {
      sequelize,
    });

    // addHook são parte de codigos que são executados de forma automatica baseado
    // em ações do utilizador. OBS: existe vários hooks disponivies.
    // nesse caso o beforeSave executa antes do utilizador ser salvo na DB
    this.addHook('beforeSave', async (user) => {
      // vericar se existe o campo password
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }
}

export default User;
