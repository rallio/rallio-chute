const {createQueue} = require('../../util/sqs/create-queue')
const {purgeQueue} = require('../../util/sqs/purge-queue')

describe('util/sqs/purge-queue', () => {
  it('should import a function', () => {
    expect(typeof purgeQueue).toBe('function')
  })

  it('should return an error when missing a QueueUrl parameter', async () => {
    let response = await purgeQueue().catch(err => err)

    expect(response).toEqual('missing required QueueUrl')
  })

  it('should return a ResponseMetadata when including a QueueUrl', async () => {
    let QueueName = 'hello-sqs'
    const { QueueUrl } = await createQueue({ QueueName })
    let response = await purgeQueue({ QueueUrl }).catch(err => err)
    expect(typeof response).toBe('object')
    expect(typeof response.ResponseMetadata).toBe('object')
    expect(typeof response.ResponseMetadata.RequestId).toBe('string')
  })
})