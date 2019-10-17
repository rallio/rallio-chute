'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Requests',
      'message_id',
      Sequelize.STRING
    )
  }
};