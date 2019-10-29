const {sqs, hackAWSCredentials} = require('../../util/sqs')

hackAWSCredentials()

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