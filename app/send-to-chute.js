const {chuteMapping} = require('./mapping');
const {saveRequest} = require('./save-request');
const {sendMessage} = require('./send-message');
const {saveSuccess} = require('./save-success');
const {removeFromSqs} = require('./remove-from-sqs');

async function sendToChute (message) { 
    const mappedResult = await chuteMapping(message, message.db, message.pkName);
   
    if (mappedResult.length > 0) {
      const mappedData =  {
        album: mappedResult[0].album_code,
        // album: 2691079,
        file_url: message.file_url,
        account_id: message.account_id,
        franchisor_id: message.franchisor_id,
        photo_id: message.photo_id,
        receiptHandle: message.receiptHandle,
        message_id: message.message_id,
        type: message.type,
        tag:message.tag
      }
      const savedToDatabaseResult = await saveRequest(mappedData);
            
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
     
      if (chuteResult !== true){
        return Promise.reject("There was no chute result")
      }
      const successData =  await saveSuccess(newData);
      console.log("!!!!!1", successData)
    
      if (!successData) {
        return Promise.reject('this stays in the queue')
      }
    
      if(newData.type === 'location'){
      const removedResult = await removeFromSqs({
        ReceiptHandle: newData.receiptHandle
      });
      console.log("removedResult",removedResult)
      return removedResult
      }else{
        return true
      }
    }
}

module.exports = { sendToChute };
