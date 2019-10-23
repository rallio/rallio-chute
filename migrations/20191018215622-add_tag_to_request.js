

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Requests',
      'tag',
      Sequelize.STRING
    )
  }
};
