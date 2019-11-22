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
        // faz a criptografia do password com o peso 8
        // OBS: o peso pode ser outro numero á escolha do utilizador
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  /* metodo que recebe todos os models da aplicação */
  static associate(models) {
    /* Cria uma associação entre this (a fonte) e o destino fornecido.
     * A chave estrangeira é adicionada na fonte. */
    this.belongsTo(models.File, { foreignKey: 'avatar_id' });
  }

  // Vericar password no memento da autenticação e atualização
  checkPassword(password) {
    // compara o password recebido com criptografado
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
