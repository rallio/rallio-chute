

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Requests',
      'receipt_handle',
      Sequelize.STRING
    )
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('Requests','receipt_handle');
  }
};