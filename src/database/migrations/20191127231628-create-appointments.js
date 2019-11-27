
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('appointments', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    user_id: {
      /* tipo do campo */
      type: Sequelize.INTEGER,
      /* qual tabela e campo devera referenciar como chave estrangeira */
      references: { model: 'users', key: 'id' },
      /* caso for atualizada deverá refletir em todas as tabelas */
      onUpdate: 'CASCADE',
      /* caso for apagado deverá colocar como Null */
      onDelete: 'SET NULL',
      allowNull: true,
    },
    provider_id: {
      /* tipo do campo */
      type: Sequelize.INTEGER,
      /* qual tabela e campo devera referenciar como chave estrangeira */
      references: { model: 'users', key: 'id' },
      /* caso for atualizada deverá refletir em todas as tabelas */
      onUpdate: 'CASCADE',
      /* caso for apagado deverá colocar como Null */
      onDelete: 'SET NULL',
      allowNull: true,
    },
    canceled_at: {
      type: Sequelize.DATE,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('files'),
};
