const faker = require('faker');
const MODEL_NAME = 'LocationMap';


module.exports = {
  up: (queryInterface) => {
    let models = [
      {
        id:1,
        album_code: 2691079,
        account_id: 52,
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent()
      }
    ];

    return queryInterface.bulkInsert(`${MODEL_NAME}s`, models, {});
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`TRUNCATE TABLE ${MODEL_NAME}s`);
  }
};
