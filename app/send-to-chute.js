const {chuteMapping} = require('./mapping');
const {saveRequest} = require('./save-request');
const {sendMessage} = require('./send-message');
const {saveSuccess} = require('./save-success');
const {removeFromSqs} = require('./remove-from-sqs');
const {getFalse, getTrue, getAll} = require('./get-false-request');
let savedToDatabaseResult;
async function sendToChute (message) { 
    const mappedResult = await chuteMapping(message, message.db, message.pkName);
   
    if (mappedResult.length > 0) {
      const mappedData =  {
        album: mappedResult[0].album_code,
        file_url: message.file_url,
        account_id: message.account_id,
        franchisor_id: message.franchisor_id,
        photo_id: message.photo_id,
        receiptHandle: message.receiptHandle,
        message_id: message.message_id,
        type: message.type,
        tag:message.tag,
        retry:message.retry
      }
      if(message.retry === false){
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
          retry:mappedData.retry
        }
        const chuteResult = await sendMessage(newData);
     
        if (chuteResult !== true){
          return Promise.reject("There was no chute result")
        }
        const successData =  await saveSuccess(newData);
    
        if (!successData) {
          return Promise.reject('this stays in the queue')
        }
    
       if(newData.type === 'location'){
         const allSuccessTrue = await getTrue(mappedData.message_id)
         const getAllRequest = await getAll(mappedData.message_id)
        
         if(allSuccessTrue.length === getAllRequest.length){
          const removedResult = await removeFromSqs({
            ReceiptHandle: message.receiptHandle
          });
          
          return removedResult
         }else{
          return true
         }
       }else{
        return true
       }
    } else {
      const newData = await getFalse(mappedData.message_id, mappedData.tag, mappedData.type, mappedData.account_id)
      
      console.log("!!!!!!!get false res", newData)
      if(newData !== null){
        const chuteResult = await sendMessage(newData);
     
        if (chuteResult !== true){
          return Promise.reject("There was no chute result")
        }
        const successData =  await saveSuccess(newData);
    
        if (!successData) {
          return Promise.reject('this stays in the queue')
        }
        
        const allTrue = await getTrue(mappedData.message_id)
        const all = await getAll(mappedData.message_id)
        
        if(allTrue.length === all.length){
          const removedResult = await removeFromSqs({
            ReceiptHandle: message.receiptHandle
          });
          return removedResult
         }else{
          return true
         }
      } else{
        const successTrue = await getTrue(mappedData.message_id)
        const allDb = await getAll(mappedData.message_id)
              
        if(allDb.length === successTrue.length){
          const removedResult = await removeFromSqs({
            ReceiptHandle: message.receiptHandle
          });
          return removedResult
         }else{
          return true
         }
      }
    }
  }
}

module.exports = { sendToChute };
