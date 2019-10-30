const {createQueue} = require('../../util/sqs/create-queue')

describe('util/sqs/create-queue', () => {
  it('should import a function', () => {
    expect(typeof createQueue).toBe('function')
  })

  it('should return an error when missing a QueueName parameter', async () => {
    let response = await createQueue().catch(err => err)

    expect(response).toEqual('missing required QueueName')
  })

  it('should return a QueueURL when including a QueueName', async () => {
    let QueueName = 'hello-sqs'
    let response = await createQueue({ QueueName }).catch(err => err)

    console.log({
      response
    })

    expect(typeof response).toBe('object')
    expect(typeof response.QueueUrl).toBe('string')
    expect(response.QueueUrl).toEqual(`http://127.0.0.1:9324/queue/${QueueName}`)
  })
})