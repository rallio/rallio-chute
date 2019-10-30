

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Requests',
      'request_success',
      Sequelize.BOOLEAN
    )
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('Requests','request_success');
  }
};

