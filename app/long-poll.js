/* eslint-disable no-console */
const longPoller = require('./long-poller');
const { removeFromSqs } = require('./remove-from-sqs');

const mockAPI = (data) => new Promise(resolve => setTimeout(() => resolve({message: '✅', data})), 100);


const emptyTheQueue = () => {
  return new Promise((resolve, reject) => {
    const recursiveFn = (count) => {
      // base case
      if (count === 0) {
        resolve();
      }

      // recursive case
      // let numberOfProcessedMessages = 3000;

      try {
        longPoller()
          .catch(console.error)
          .then(async (messages) => {
            const messagesProccessedPromise = messages.map(async (message) => {
              const body = JSON.parse(message.Body);
              const { tags } = body;
              const tagsProcessedPromise = tags.map(tag => mockAPI(tag)); // async array promises
              const tagsProcessed = await Promise.all(tagsProcessedPromise).catch(reject);

              await removeFromSqs(message).catch((e) => {
                console.error('remove error', e)
                reject(e);
              }).then(() => console.log('removed message', message));

              return tagsProcessed;
            });

            const messagesProccessed = await Promise.all(messagesProccessedPromise).catch(reject);

            return numberOfProcessedMessages + messagesProccessed.length;
          }).then(resolve);
      } catch(err) {
        reject(err);
      }
    }
  });
}

emptyTheQueue()
  .catch((e) => {
    if (e.message === 'no messages') {
      return Infinity
    }
  })
  .then((numberOfItems) => {

  })

