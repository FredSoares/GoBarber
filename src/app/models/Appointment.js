import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Appointment extends Model {
  static init(sequelize) {
    super.init({
      date: Sequelize.DATE,
      canceled_at: Sequelize.DATE,
      past: {
        type: Sequelize.VIRTUAL,
        get() {
          return isBefore(this.date, new Date());
        },
      },
      cancelable: {
        type: Sequelize.VIRTUAL,
        get() {
          return isBefore(new Date(), subHours(this.date, 2));
        },
      },
    },
    {
      sequelize,
    });

    return this;
  }

  /* metodo que recebe todos os models da aplicação */
  static associate(models) {
    /* Cria uma associação entre this (a fonte) e o destino fornecido.
     * A chave estrangeira é adicionada na fonte. */
    /* OBS: quando o relacionamento é entre mais que 2 tabelas é obrigatorio
     * utilizar o as:'nome do relacionamento' */
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointment;
