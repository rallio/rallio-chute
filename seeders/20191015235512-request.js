const faker = require('faker');
const MODEL_NAME = 'Request';
const ACCOUNT_IDS = [1, 2, 3];

module.exports = {
  up: (queryInterface) => {
    let insertRequests = [];
    insertRequests.length = 100;
    insertRequests.fill(null);

    return Promise.all(
      insertRequests.map(() => {
        return {
          id: faker.random.number(),
          album: faker.lorem.word(),
          account_id: faker.helpers.shuffle(ACCOUNT_IDS)[0],
          url: faker.image.imageUrl(),
          photo_id: faker.random.number(),
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
