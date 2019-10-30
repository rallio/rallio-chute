const faker = require('faker');
const MODEL_NAME = 'TagMap';

module.exports = {
  up: (queryInterface) => {
    let models = [
      {
        id:1,
        album_code:2691441,
        tag: 'pet',
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent()
      },
      {
        id:2,
        album_code:2691111,
        tag: 'cat',
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent()
      },
      {
        id:3,
        album_code:2691078,
        tag: 'animal',
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent()
      }

    ];

    return queryInterface.bulkInsert(`${MODEL_NAME}s`, models, {});
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`TRUNCATE TABLE TagMaps`);
  }
};
