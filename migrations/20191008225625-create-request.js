module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Requests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      album: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      },
      account_id: {
        type: Sequelize.INTEGER
      },
      franchisor_id: {
        type: Sequelize.INTEGER
      },
      photo_id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('Requests');
  }
};