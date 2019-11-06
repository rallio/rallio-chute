const handleMessages = ({
  messages = [],
  checkDB = require('./check-existing').checkDB,
  checkRetry = require('./check-retry').checkRetry,
  sendToChute = require('./send-to-chute').sendToChute
} = {}) => {
  return messages.map(async (message) => {
    const { photo_tags = [] } = message;
    const messageIdExists = await checkDB(message.MessageId);
    const retry = await checkRetry(messageIdExists);

    const processedTags = Promise.all(photo_tags.split(',').map(tag => {
      const messageObject = {
        tag: tag,
        file_url: message.photo_url,
        account_id: message.account_id,
        franchisor_id: message.franchisor_id,
        photo_id: message.photo_id,
        receiptHandle: message.ReceiptHandle,
        message_id: message.MessageId,
        type: 'tag',
        db: 'TagMap',
        pk: tag,
        pkName: 'tag',
        retry: retry
      };
      console.info('handle-messages tag and message object', {tag, messageObject});

      return sendToChute(messageObject);
    }));

    const locationObject = {
      tag: null,
      file_url: message.photo_url,
      account_id: message.account_id,
      franchisor_id: message.franchisor_id,
      photo_id: message.photo_id,
      receiptHandle: message.ReceiptHandle,
      message_id: message.MessageId,
      type: 'location',
      db: 'LocationMap',
      pk: message.account_id,
      pkName: 'account_id',
      retry: retry
    };

    // console.info('handle-messages location object', {
    //   locationObject
    // });

    const processedLocation = sendToChute(locationObject);
    const promises = [
      processedTags.then(() => true),
      processedLocation
    ];

    return Promise.all(promises).then(() => {
      return message;
    });
  });
};

module.exports = { handleMessages };
