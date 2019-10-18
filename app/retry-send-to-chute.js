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
const getFalseResult = await getFalse(id)

async function retrySendToChute (message) { 
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
console.log("removedResult",removedResult)
}