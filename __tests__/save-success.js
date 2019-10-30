const saveSuccess = require('../app/save-success')
const models = require('../models')

describe ('check-exisiting component checks if message_id already exisis in database ', () => {
    let recordOne
   
    beforeEach(async ()=> {
        await  models.sequelize.queryInterface.bulkDelete('Requests', null, {})
        recordOne = await models.Request.create({ album: '12345', url: 'http://testphoto.com', account_id: 51, franchisor_id: 6, photo_id: 333, type: 'tag', receipt_handle: '222222', message_id: '4444444', tag: 'pet'})
 
     })

    test('check saveSuccess type', () => {
        expect(typeof saveSuccess).toBe('object')
    })
    test('check saveSuccess function type', () => {
        expect(typeof saveSuccess.saveSuccess).toBe('function')
    })
    test('request model type', () => {
        expect(typeof models.Request).toBe('function')
    })
    test('request_success attribute should update', async () => { 
        let result = await saveSuccess.saveSuccess(recordOne)
        expect(result).toHaveLength(1)
     })


})