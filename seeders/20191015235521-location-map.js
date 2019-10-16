const faker = require('faker');
const MODEL_NAME = 'LocationMap';
const ACCOUNT_IDS = [1, 2, 3]
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
          album_code: faker.helpers.shuffle(ALBUM_CODES)[0],
          account_id: faker.helpers.shuffle(ACCOUNT_IDS)[0],
          createdAt: faker.date.past(),
          updatedAt: faker.date.recent()
        };
      })
    ).then(models => {
      return queryInterface.bulkInsert(`${MODEL_NAME}s`, models, {});
    });
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`TRUNCATE TABLE ${MODEL_NAME}s`);
  }
};
