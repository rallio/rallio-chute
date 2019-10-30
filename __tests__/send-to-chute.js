const sendToChute = require('../app/send-to-chute')
const models = require('../models')
describe('message goes through process to get sent to chute', () => {
    let record
    let tag
    beforeEach(async ()=> {
        await  models.sequelize.queryInterface.bulkDelete('Requests', null, {})
        await  models.sequelize.queryInterface.bulkDelete('LocationMaps', null, {})
        await  models.sequelize.queryInterface.bulkDelete('TagMaps', null, {})
        record = await models.LocationMap.create({ album_code: 1111, account_id: 51 })
        tag = await models.TagMap.create({ album_code: 2222, tag: 'pet' })
        recordRetry = await models.Request.create({ album: '12345', url: 'http://testphoto.com', account_id: 51, franchisor_id: 6, photo_id: 333, type: 'tag', receipt_handle: '222222', message_id: '4444444', tag: 'pet'})
     })
      
let message = {
    tag: null,
    file_url: "https://res.cloudinary.com/ralliohq/e_improve/x_14,y_989,w_3199,h_2042,c_crop/q_auto/zghqoszspuxxgq7b7ioi.jpg",
    account_id: 51,
    franchisor_id: 6,
    photo_id: 79,
    receiptHandle: "55555",
    message_id: "66666",
    type: 'location',
    db: 'LocationMap',
    pk: 51,
    pkName: 'account_id',
    retry: false 
}
let messageRetry = {
    tag: null,
    file_url: "http://testphoto.com",
    account_id: 51,
    franchisor_id: 6,
    photo_id: 333,
    receiptHandle: "222222",
    message_id: "4444444",
    type: 'location',
    db: 'LocationMap',
    pk: 51,
    pkName: 'account_id',
    retry: true 
}
let messageTagRetry = {
    tag: 'pet',
    file_url: "http://testphoto.com",
    account_id: 51,
    franchisor_id: 6,
    photo_id: 333,
    receiptHandle: "222222",
    message_id: "4444444",
    type: 'tag',
    db: 'TagMap',
    pk: 'pet',
    pkName: 'tag',
    retry: true 
}
let messageTag = {
    tag: 'pet',
    file_url: "http://testphoto.com",
    account_id: 51,
    franchisor_id: 6,
    photo_id: 333,
    receiptHandle: "222222",
    message_id: "4444444",
    type: 'tag',
    db: 'TagMap',
    pk: 'pet',
    pkName: 'tag',
    retry: false 
}
  
 let sendMessage = () => new Promise(function(resolve) {
     return resolve(
        {
          code:201,
          href:"http://api.getchute.com/v2/albums/2691441/assets/upload",
          method:"POST",
          title:"AlbumAsset Details",
          version:2
        }
     )
  })
  let sendMessageFail = () => new Promise(function(resolve) {
    return resolve(false)
 })
 
    test('removes from queue', async () => {
       const result = await sendToChute.sendToChute({message, send: sendMessage}) 
       
       expect(typeof result).toBe('object')
    })
    test('does not remove from queue', async () => {
        const result = await sendToChute.sendToChute({message: messageRetry, send: sendMessageFail}).catch(err => err) 
        expect(result.message).toBe('There was no chute result')
     })

       
    test('removes from queue if retry true', async () => {
        const result = await sendToChute.sendToChute({message: messageTag, send: sendMessage}) 
        
        expect(typeof result).toBe('object')
     })
     test('does not remove from queue if retry true', async () => {
        const result = await sendToChute.sendToChute({message: messageTagRetry, send: sendMessageFail}).catch(err => err) 
        
        expect(result.message).toBe('There was no chute result')
     })


     
})