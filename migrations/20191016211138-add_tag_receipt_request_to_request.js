'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Requests',
      'request_success',
      Sequelize.BOOLEAN
    )
  }
};

