
const {getSqs} = require('./consume-liked-photos');
const {chuteMapping} = require('./mapping');

async function start () {
  const sqsResult = await getSqs();
  console.log("result from sqs", sqsResult)
  const mappedDataPromises = sqsResult.map(async (result) => {
    const mappedResult = await chuteMapping(result, 'TagMap', 'tag');
    console.log("$$$$$result from mapped", mappedResult)
    if (mappedResult.length > 0) {
      return mappedResult.then((value) => {
        console.log("@@@@@VALUE!!!", value)
        return {
          album: value.dataValues.album_code,
          file_url: result.file_url,
          acocunt_id: result.account_id,
          franchisor_id: result.franchisor_id,
          photo_id: result.photo_id
        }
      })
    } else {
      return {}
    }
  })
  // const mappedResult = await chuteMapping(sqsResult);
  const mappedData = await Promise.all(mappedDataPromises)
  console.log("result from mappedData", mappedData)
  // if (mappedResult !== false) {
  //   console.log("continue")
  //   const savedToDatabaseResult = await savedToDatabase(mappedResult);
  //   const chuteResult = await sendMessage(sqsResult);
  //   console.log("result from chuteResult", chuteResult)
  // }
}

start()
