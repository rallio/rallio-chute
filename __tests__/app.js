const {
  start
} = require('../app/index')

const { sendMessage } = require('../util/sqs/send-message')
const { createQueue } = require('../util/sqs/create-queue')

describe('app', () => {
  it('should import', () => {
    expect(typeof start).toBe('function')
  })
})

describe('util/sqs/send-message', () => {
  it('create a queue and send a message to it', async () => {
    let { QueueUrl } = await createQueue({ QueueName: 'util-sqs-send-message' }).catch(err => err)
    let response = await sendMessage({ QueueUrl }).catch(err => err)

    expect(typeof response).toBe('object')
  })
})


describe('app/start', () => {
  let QueueName = 'liked-photos'

  it('should start and empty a queue', async () => {
    const { QueueUrl } = await createQueue({ QueueName })
    let sendMessageResponse = await sendMessage({ QueueUrl }).catch(err => err)
    expect(typeof sendMessageResponse.MD5OfMessageAttributes).toBe('string')
    expect(typeof sendMessageResponse.MD5OfMessageBody).toBe('string')
    expect(typeof sendMessageResponse.MessageId).toBe('string')
    expect(typeof sendMessageResponse.ResponseMetadata).toBe('object')

    let response = await start({
      sendToChute: () => Promise.resolve({}),
      QueueUrl
    }).catch(err => err)

    expect(typeof response).toBe('object')
    expect(response.pollCount >= 1).toBe(true)
    expect(response.processedMessagesCount >= 1).toBe(true)
  })
})