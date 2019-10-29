const getFalseRequest = require('../app/get-false-request')
const models = require('../models')

describe ('retreiving record object based on requests_success', () => {
    let recordOne
    let recordTwo
    let recordThree
    let recordFour
    beforeEach(async ()=> {
        await  models.sequelize.queryInterface.bulkDelete('Requests', null, {})
        recordOne = await models.Request.create({ album: '12345', url: 'http://testphoto.com', account_id: 51, franchisor_id: 6, photo_id: 333, type: 'location', receipt_handle: '222222', message_id: '4444444', tag: null, request_success: null})
        recordTwo = await models.Request.create({ album: '67890', url: 'http://testphoto.com', account_id: 52, franchisor_id: 7, photo_id: 444, type: 'tag', receipt_handle: '333333', message_id: '555555', tag: 'pet', request_success: null})
        recordThree = await models.Request.create({ album: '12345', url: 'http://testphoto.com', account_id: 51, franchisor_id: 6, photo_id: 555, type: 'location', receipt_handle: '444444', message_id: '666666', tag: null, request_success: true})
        recordFour = await models.Request.create({ album: '67890', url: 'http://testphoto.com', account_id: 52, franchisor_id: 7, photo_id: 666, type: 'tag', receipt_handle: '555555', message_id: '777777', tag: 'pet', request_success: true})
        recordFive = await models.Request.create({ album: '67890', url: 'http://testphoto.com', account_id: 52, franchisor_id: 7, photo_id: 666, type: 'tag', receipt_handle: '555555', message_id: '777777', tag: 'animal', request_success: null})
 
     })
    test('check getFalseRequest type', () => {
        expect(typeof getFalseRequest).toBe('object')
    })
    test('check getFalseRequest function type', () => {
        expect(typeof getFalseRequest.getFalse).toBe('function')
    })
    test('request model type', () => {
        expect(typeof models.Request).toBe('function')
    })
    test('location has null request_success value', async () => { 
        let message_id = '4444444'
        let tag = null
        let type = 'location'
        let account_id = '51'
        let result = await getFalseRequest.getFalse(message_id, tag, type, account_id)
        
        expect(typeof result).toBe('object')
     })
    test('location has true request_success value', async () => { 
        let message_id = '666666'
        let tag = null
        let type = 'location'
        let account_id = '51'
        let result = await getFalseRequest.getFalse(message_id, tag, type, account_id)
        
        expect(result).toBeNull()
     })
     test('tag has null request_success value', async () => { 
        let message_id = '4444444'
        let tag = 'pet'
        let type = 'tag'
        let account_id = '52'
        let result = await getFalseRequest.getFalse(message_id, tag, type, account_id)
        
        expect(typeof result).toBe('object')
     })
    test('tag has true request_success value', async () => { 
        let message_id = '666666'
        let tag = 'pet'
        let type = 'tag'
        let account_id = '52'
        let result = await getFalseRequest.getFalse(message_id, tag, type, account_id)
        
        expect(result).toBeNull()
     })
     test('all messages with same message_id and request_success true', async () => { 
        let message_id = '777777'
        let result = await getFalseRequest.getTrue(message_id)
        
        expect(result).toHaveLength(1)
     })
     test('all messages with same message_id', async () => { 
        let message_id = '777777'
        let result = await getFalseRequest.getAll(message_id)
        
        expect(result).toHaveLength(2)
     })

    

})