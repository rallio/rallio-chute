

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Requests',
      'type',
      Sequelize.STRING
    )
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('Requests','type');
  }
};
