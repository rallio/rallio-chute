const saveRequest = require('../app/save-request')
const models = require('../models')

describe ('test save request component', () => {
    let record
    beforeEach(async ()=> {
        await  models.sequelize.queryInterface.bulkDelete('Requests', null, {})
          record = await models.Request.create({ album: '12345', url: 'http://testphoto.com', account_id: 52, franchisor_id: 6, photo_id: 333, type: 'tag', receipt_handle: '222222', message_id: '4444444', tag: 'pet'})
 
     })
 
    test('check saveRequest type', () => {
        expect(typeof saveRequest).toBe('object')
    })
    test('check saveRequest function type', () => {
        expect(typeof saveRequest.saveRequest).toBe('function')
    })
    test('request model type', () => {
        expect(typeof models.Request).toBe('function')
    })
    test('check if record exists', async () => { 
        expect(typeof record).toBe('object')
     })
    test('saveREquest function creates new instance in database', async () => { 
        let result = await saveRequest.saveRequest({ album: '6789', file_url: 'http://testphoto33.com', account_id: 52, franchisor_id: 6, photo_id: 444, type: 'tag', receiptHandle: '222222', message_id: '4444444', tag: 'dog'})
        let id = result.id
        expect(typeof id).toBe('number')
     })
     test('request success colomn should be null', async () => { 
        let request_success = record.request_success
        expect(request_success).toBeNull()
     })
})