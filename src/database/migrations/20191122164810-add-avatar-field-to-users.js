module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    /* tabela a inserir */
    'users',
    /* coluna a inserir */
    'avatar_id',
    {
      /* tipo do campo */
      type: Sequelize.INTEGER,
      /* qual tabela e campo devera referenciar como chave estrangeira */
      references: { model: 'files', key: 'id' },
      /* caso for atualizada deverá refletir em todas as tabelas */
      onUpdate: 'CASCADE',
      /* caso for apagado deverá colocar como Null */
      onDelete: 'SET NULL',
      allowNull: true,
    },
  ),

  down: (queryInterface) => queryInterface.removeColumn('users', 'avatar_id'),
};
