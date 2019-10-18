const longPoller = require('./long-poller');
const {getTags} = require('./get-tags');
const {getSqs} = require('./consume-liked-photos');
const {chuteMapping} = require('./mapping');
const {saveRequest} = require('./save-request');
const {checkDB} = require('./check-existing');
const {getFalse} = require('./get-false-request');
const {sendMessage} = require('./send-message');
const {saveSuccess} = require('./save-success');
const {removeFromSqs} = require('./remove-from-sqs');

const flat = ((a, b) => [].concat(a, b));
const flatten = arr => arr.reduce(flat, [])

async function sendToChute (message) {
    console.log("!!!!!!message",message.tag)
    const mappedResult = await chuteMapping(message, message.db, message.type);
    console.log("!!!!!!mappedResult",mappedResult)
    if (mappedResult.length > 0) {
      const mappedData =  {
        album: mappedResult[0].album_code,
        file_url: message.file_url,
        account_id: message.account_id,
        franchisor_id: message.franchisor_id,
        photo_id: message.photo_id,
        receiptHandle: message.receiptHandle,
        message_id: message.message_id,
        type: message.tag
      }
      const savedToDatabaseResult = await saveRequest(mappedData);
      console.log("!!!!!!savedToDatabaseResult",savedToDatabaseResult)
      
      const newData = {
        album: mappedData.album,
        file_url: mappedData.file_url,
        account_id: mappedData.account_id,
        franchisor_id: mappedData.franchisor_id,
        photo_id: mappedData.photo_id,
        receiptHandle: mappedData.receiptHandle,
        type: mappedData.type,
        message_id: mappedData.message_id,
        id: savedToDatabaseResult.id
      }
      const chuteResult = await sendMessage(newData);
      console.log("!!!!!!savedToDatabaseResult",chuteResult)
      if (chuteResult !== true){
        return reject("There was no chute result")
      }
      const successData =  await saveSuccess(newData);
      console.log("!!!!!1", successData)
    //   const resultChutePromise = await Promise.all(sendToChutePromises)
    //   const flattened = flatten(resultChutePromise)
    //   const allGood = flattened.every(Boolean)
  
      if (!successData) {
        return Promise.reject('this stays in the queue')
      }
    
      const removedResult = await removeFromSqs({
        ReceiptHandle: newData.receiptHandle
      });
      console.log("removedResult",removedResult)
      return removedResult

    }
}

module.exports = { sendToChute };
