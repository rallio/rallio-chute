const chuteMapping = require('../app/mapping')
const models = require('../models')

describe ('test mapping ', () => {
    let record
  
    beforeEach(async ()=> {
       await  models.sequelize.queryInterface.bulkDelete('TagMaps', null, {})
         record = await models.TagMap.create({album_code: 1111, tag: 'pet'})

    })

    test('check chuteMapping type', () => {
        expect(typeof chuteMapping).toBe('object')
    })
    test('check chuteMapping type ', () => {
        expect(typeof chuteMapping.chuteMapping).toBe('function')
    })
    test('tagMap model type', () => {
        expect(typeof models.TagMap).toBe('function')
    })
    test('check if record exists', async () => { 
       expect(typeof record).toBe('object')
    })
})