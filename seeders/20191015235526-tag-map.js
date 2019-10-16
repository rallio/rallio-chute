const faker = require('faker');
const MODEL_NAME = 'TagMap';
const ALBUM_CODES = [
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
];

module.exports = {
  up: (queryInterface) => {
    let insertRequests = [];
    insertRequests.length = 100;
    insertRequests.fill(null);

    return Promise.all(
      insertRequests.map(() => {
        return {
          id: faker.random.number(),
          album_code:faker.helpers.shuffle(ALBUM_CODES)[0],
          tag: faker.random.word(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.recent()
        };
      })
    ).then(models => {
      console.table('tag models', models)
      return queryInterface.bulkInsert(`${MODEL_NAME}s`, models, {});
    });
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`TRUNCATE TABLE TagMaps`);
  }
};
