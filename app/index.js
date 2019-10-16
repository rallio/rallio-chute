
const {getSqs} = require('./consume-liked-photos');
const {chuteMapping} = require('./mapping');
const {saveRequest} = require('./save-request');
const {sendMessage} = require('./send-message');
const {saveSuccess} = require('./save-success');
const {removeFromSqs} = require('./remove-from-sqs');

const flat = ((a, b) => [].concat(a, b));
const flatten = arr => arr.reduce(flat, [])

async function start () {
  const sqsResult = await getSqs();
  // console.log("result from sqs", sqsResult.length)
  const mappedDataPromises = sqsResult.map(async (result) => {
    const mappedResult = await chuteMapping(result, 'TagMap', 'tag');
    // console.log("$$$$$result from mapped",mappedResult.length, mappedResult)
    if (mappedResult.length > 0) {
        // console.log("@@@@@VALUE!!!", mappedResult[0].album_code,result.file_url )
        return {
          album: mappedResult[0].album_code,
          file_url: result.file_url,
          account_id: result.account_id,
          franchisor_id: result.franchisor_id,
          photo_id: result.photo_id,
          receiptHandle: result.receiptHandle,
          type: 'tag'
        }
    }
  })
  const mappedLocation = await chuteMapping(sqsResult[0], 'LocationMap', 'account_id')
  console.log("!!!!!!!!!mappedLocation", mappedLocation)
  const location = {
          album: mappedLocation[0].album_code,
          file_url: sqsResult[0].file_url,
          account_id: sqsResult[0].account_id,
          franchisor_id: sqsResult[0].franchisor_id,
          photo_id: sqsResult[0].photo_id,
          receiptHandle: sqsResult[0].receiptHandle,
          type: 'location'
  }
  // console.log("!!!!!!!!!!!!location", location)
  const mappedData = await Promise.all(mappedDataPromises)
  // console.log("^^^^^^result from mappedData", mappedData.filter(Boolean))
  mappedData.push(location)  
  // console.log("^^^^^^^^^mappedData", mappedData)
  const filteredMappedData = mappedData.filter(Boolean)
  const sendToChutePromises = filteredMappedData.map(async (data)=> {
    const savedToDatabaseResult = await saveRequest(data);
    console.log("#######DB result", savedToDatabaseResult.id)
    const newData = {
      album: data.album,
      file_url: data.file_url,
      account_id: data.account_id,
      franchisor_id: data.franchisor_id,
      photo_id: data.photo_id,
      receiptHandle: data.receiptHandle,
      type: data.type,
      id: savedToDatabaseResult.id
    }
    const chuteResult = await sendMessage(newData);
    console.log("**********result from chuteResult", chuteResult)
    if (chuteResult !== true){
      return reject("There was no chute result")
    }
    const successData =  await saveSuccess(newData);
    console.log("data", successData)
     return successData
  
 
  })
  const resultChutePromise = await Promise.all(sendToChutePromises)
  console.log("*******sendToChutePromises", resultChutePromise)
  const flattened = flatten(resultChutePromise)
  
  const allGood = flattened.every(Boolean)
  console.log("allGood", allGood)
  if (!allGood) {
    return Promise.reject('this stays in the queue')
  }

  const removedResult = await removeFromSqs(filteredMappedData[0]);
  console.log("removedResult", removedResult)
}
// debugger
start()
