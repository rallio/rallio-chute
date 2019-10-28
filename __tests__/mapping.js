const chuteMapping = require('../app/mapping')
const Sequelize = require('sequelize')
// const env = process.env.NODE_ENV || 'development';
// const config = require('../config/db.js');
// const { database, username, password, host, dialect } = config[env]
const models = require('../models')
const tagMapMigration = require('../migrations/20191011210727-create-tag-map')
describe ('test mapping ', () => {
    let record
    beforeEach(async ()=> {
        debugger
       await  models.sequelize.queryInterface.bulkDelete('TagMaps', null, {})
        .then((record)=> {
            console.log("worked", record)
        })
        .catch((err) => {debugger; console.log("errror", err)})
        debugger
         record = await models.TagMap.create({album_code: 1111, tag: 'pet'})
    })
    // const sequelize = new Sequelize(database, username, password, {
    //     host, dialect, logging: false
    //   });
    test('maps to correct name', () => {
        expect(typeof chuteMapping).toBe('object')
    })
    test('maps to correct name', () => {
        expect(typeof chuteMapping.chuteMapping).toBe('function')
    })
    test('sequelize', () => {
        expect(typeof models.TagMap).toBe('function')
    })
    test('sequelize', async () => {
        Sequelize
        debugger
    
       expect(typeof record).toBe('object')
    })
})