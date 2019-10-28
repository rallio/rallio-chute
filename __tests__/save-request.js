const saveRequest = require('../app/save-request')
const Sequelize = require('sequelize')
const models = require('../models')

describe ('test saeve request ', () => {
  
    test('check saveRequest type', () => {
        expect(typeof saveRequest).toBe('object')
    })
    test('check saveRequest function type', () => {
        expect(typeof saveRequest.saveRequest).toBe('function')
    })
   
})