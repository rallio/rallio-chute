

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Requests',
      'receipt_handle',
      Sequelize.STRING
    )
  }
};