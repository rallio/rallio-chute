const {chuteMapping} = require('./mapping');
const {saveRequest} = require('./save-request');
const {sendMessage} = require('../util/send-message');
const {sendDetails} = require('../util/update-message');
const {saveSuccess} = require('./save-success');
// const {removeFromSqs} = require('./remove-from-sqs');
// const {getFalse, getTrue, getAll} = require('./get-false-request');
const {getFalse} = require('./get-false-request');
let savedToDatabaseResult;
async function sendToChute ({message, send = sendMessage, details = sendDetails, save = saveSuccess}) {
  const mappedResult = await chuteMapping({pk: message.pk, modelName: message.db, pkName: message.pkName}).catch(console.error);

console.log("mappedResult!!!!!!", mappedResult)

  if (!mappedResult) {
    console.info('a location or tag was found that doesnt have any matching maps in the DB.', message);
    return Promise.resolve(message);
  }
  
  const mappedData =  {
    album: mappedResult.album_code,
    file_url: message.file_url,
    account_id: message.account_id,
    franchisor_id: message.franchisor_id,
    photo_id: message.photo_id,
    receiptHandle: message.receiptHandle,
    message_id: message.message_id,
    type: message.type,
    tag:message.tag,
    retry:message.retry,
    description: message.description,
    all_tags: message.all_tags
  };
  
  if (message.retry === false) {
    savedToDatabaseResult = await saveRequest(mappedData);

    const newData = {
      album: mappedData.album,
      file_url: mappedData.file_url,
      account_id: mappedData.account_id,
      franchisor_id: mappedData.franchisor_id,
      photo_id: mappedData.photo_id,
      receiptHandle: mappedData.receiptHandle,
      type: mappedData.type,
      message_id: mappedData.message_id,
      id: savedToDatabaseResult.id,
      retry:mappedData.retry,
      description: mappedData.description,
      all_tags: mappedData.all_tags
    };

    const chuteResult = await send(newData).catch(console.error);
    console.log("CHUTE RESULT!!!!!!!!!!!!!", chuteResult)

    if (!chuteResult.response) { 
      
      return Promise.reject({
        message: 'There was no chute result',
        data: newData
      });
    }

    const chuteDetailsResult = await details({data: newData, firstResult:chuteResult})
    
    if (!chuteDetailsResult) {   
      return Promise.reject({
        message: 'There was no chute result',
        data: newData
      });
    }

    const successData =  await save(newData);

    if (!successData) {
      return Promise.reject('this stays in the queue');
    }

    return chuteResult;
  } else { // message.retry !== false
    
    const newData = await getFalse(mappedData.message_id, mappedData.tag, mappedData.type, mappedData.account_id);

    if (newData !== null) {
      const chuteResult = await send(newData).catch(console.error);

      if (!chuteResult.response) {
        
        return Promise.reject({
          message: 'There was no chute result',
          data: newData
        });
      }
      
      const chuteDetailsResult = await details({data: newData, firstResult:chuteResult})
      if (!chuteDetailsResult) {   
        return Promise.reject({
          message: 'There was no chute result',
          data: newData
        });
      }

      const successData = await save(newData);

      if (!successData) {
        
        return Promise.reject('this stays in the queue');
      }

      return chuteResult;
    }
  }
}

module.exports = { sendToChute };
