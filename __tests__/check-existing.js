const checkExisting = require('../app/check-existing')
const models = require('../models')

describe ('check-exisiting component checks if message_id already exisis in database ', () => {
    beforeEach(async ()=> {
        await  models.sequelize.queryInterface.bulkDelete('Requests', null, {})
        await models.Request.create({ album: '12345', url: 'http://testphoto.com', account_id: 51, franchisor_id: 6, photo_id: 333, type: 'tag', receipt_handle: '222222', message_id: '4444444', tag: 'pet', request_success: true})
        await models.Request.create({ album: '67890', url: 'http://testphoto.com', account_id: 52, franchisor_id: 7, photo_id: 444, type: 'tag', receipt_handle: '222222', message_id: '555555', tag: 'pet'})
 
     })

    test('check checkExisting type', () => {
        expect(typeof checkExisting).toBe('object')
    })
    test('check checkExisting function type', () => {
        expect(typeof checkExisting.checkDB).toBe('function')
    })
    test('request model type', () => {
        expect(typeof models.Request).toBe('function')
    })
    test('message id should exist in the database', async () => { 
        let id = '4444444'
        let result = await checkExisting.checkDB(id)
        expect(result).toHaveLength(1)
     })
     test('message id does not exist in the database', async () => { 
        let id = '6666666'
        let result = await checkExisting.checkDB(id)
        expect(result).toHaveLength(0)
     })


})