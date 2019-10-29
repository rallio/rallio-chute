const {sqs} = require('../../util/sqs')
// const AWS = require('aws-sdk')

// AWS.config.update({
//   accessKeyId: '...',
//   secretAccessKey: '...'
// })

describe('util/sqs', () => {
  it('imports a function', () => {
    expect(typeof sqs).toBe('function')
  })
  it('can invoke the function for an instance of sqs', () => {
    let db = sqs()
    expect(typeof db).toBe('object')
  })
  it('can invoke the function for an instance of sqs', () => {
    let db = sqs()
    expect(typeof db).toBe('object')
  })
})