

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Requests',
      'message_id',
      Sequelize.STRING
    )
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('Requests','message_id');
  }
};