const { sendToChute } = require('./send-to-chute');
const {checkDB} = require('./check-existing');
const handleMessages = ({messages, db = checkDB, send = sendToChute}) => {
    
    var handleMessagePromises = messages.map(async (message) => {
      
      const { photo_tags = [] } = message;
      
      console.log("db.message", message)
      const messageIdExists = await db(message.MessageId);
      
      const retry = checkRetry(messageIdExists);
      
      await Promise.all(photo_tags.split(',').map(tag => {
        
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
          retry: retry,
          description: message.photo_description,
          all_tags: message.photo_tags
        };
  
        return send({message: messageObject})
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
        retry:retry,
        description: message.photo_description,
        all_tags: message.photo_tags
      };
  
      await send({message: locationObject});
      return message
    });
   return Promise.all(handleMessagePromises)
  }


  function checkRetry(messageIdExists){
    if (messageIdExists.length > 0){
      return true
    }else{
      return false
    }
  }

  module.exports = { handleMessages }