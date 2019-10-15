
const {getSqs} = require('./consume-liked-photos');
const {chuteMapping} = require('./mapping');
const {saveRequest} = require('./save-request');
const {sendMessage} = require('./send-message');

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
          acocunt_id: result.account_id,
          franchisor_id: result.franchisor_id,
          photo_id: result.photo_id
        }
    } 
  })
  const mappedData = await Promise.all(mappedDataPromises)
  console.log("^^^^^^result from mappedData", mappedData.filter(Boolean))
  const filteredMappedData = mappedData.filter(Boolean)
  // filteredMappedData.map(async (data)=> {
  //   const savedToDatabaseResult = await saveRequest(data);
  // })
  filteredMappedData.map(async (data)=> {
    const chuteResult = await sendMessage(data);
    console.log("result from chuteResult", chuteResult)
  })
  
  
}
// debugger
start()
