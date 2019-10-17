
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

async function start () {
  const sqsResult = await getSqs();
  const messageIdExists = await checkDB(sqsResult[0].message_id)
  if (messageIdExists.length > 0){
    const newReceipt = sqsResult[0].receiptHandle
    retry(sqsResult[0].message_id, newReceipt)
  }else{
    const mappedDataPromises = sqsResult.map(async (result) => {
      const mappedResult = await chuteMapping(result, 'TagMap', 'tag');
      if (mappedResult.length > 0) {
        return {
        album: mappedResult[0].album_code,
        file_url: result.file_url,
        account_id: result.account_id,
        franchisor_id: result.franchisor_id,
        photo_id: result.photo_id,
        receiptHandle: result.receiptHandle,
        message_id: result.message_id,
        type: 'tag'
        }
      }
    })
    const mappedLocation = await chuteMapping(sqsResult[0], 'LocationMap', 'account_id')
  
    const location = {
            album: mappedLocation[0].album_code,
            file_url: sqsResult[0].file_url,
            account_id: sqsResult[0].account_id,
            franchisor_id: sqsResult[0].franchisor_id,
            photo_id: sqsResult[0].photo_id,
            receiptHandle: sqsResult[0].receiptHandle,
            message_id: sqsResult[0].message_id,
            type: 'location'
    }
    
    const mappedData = await Promise.all(mappedDataPromises)
    mappedData.push(location)  
    const filteredMappedData = mappedData.filter(Boolean)

    const sendToChutePromises = filteredMappedData.map(async (data)=> {
      const savedToDatabaseResult = await saveRequest(data);
     
      const newData = {
        album: data.album,
        file_url: data.file_url,
        account_id: data.account_id,
        franchisor_id: data.franchisor_id,
        photo_id: data.photo_id,
        receiptHandle: data.receiptHandle,
        type: data.type,
        message_id: data.message_id,
        id: savedToDatabaseResult.id
      }
      const chuteResult = await sendMessage(newData);
     
      if (chuteResult !== true){
        return reject("There was no chute result")
      }
      const successData =  await saveSuccess(newData);
      return successData
    })

    const resultChutePromise = await Promise.all(sendToChutePromises)
    const flattened = flatten(resultChutePromise)
    const allGood = flattened.every(Boolean)
 
    if (!allGood) {
      return Promise.reject('this stays in the queue')
    }
  
    const removedResult = await removeFromSqs(filteredMappedData[0].receiptHandle);
  }
  
}
async function retry (id, newReceipt) {
  const getFalseResult = await getFalse(id)
  
  const sendToChutePromises = getFalseResult.map(async (data)=> {
    const chuteResult = await sendMessage(data);

    if (chuteResult !== true){
       return reject("There was no chute result")
    }
    const successData =  await saveSuccess(data);
    return successData
  })
  const resultChutePromise = await Promise.all(sendToChutePromises)
  const flattened = flatten(resultChutePromise)   
  const allGood = flattened.every(Boolean)
 
  if (!allGood) {
    return Promise.reject('this stays in the queue')
  }
  
  const removedResult = await removeFromSqs(newReceipt);
}

start()
