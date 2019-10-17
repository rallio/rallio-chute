/* eslint-disable no-console */
const longPoller = require('./long-poller');
const { removeFromSqs } = require('./remove-from-sqs');

const sendToChute = (tag, message) => {
  console.log(`simulate sending ${tag} ${message.ReceiptHandle.slice(0, 5)}`);
  return new Promise((resolve) =>
    // process tag, if there isnt already a tag for this message
    setTimeout(() => {resolve(1)}, 500)
  ).catch(handleChuteFailure)
}

const handleChuteFailure = () => {
  // ... todo
  // update the message entry with success: `false`
  // return true
  // debugger
}

const removeMessageFromQueue = message => removeFromSqs(message);

const handleMessages = async (messages) => {
  const messagesProcessedPromise = messages.map(async (message) => {
    const { tags = [] } = message;

    const processedTags = Promise.all(tags.map(tag => {
      return sendToChute(tag, message).catch(handleChuteFailure)
    }));
    return processedTags.then(() => {
      return removeMessageFromQueue(message);
    });
  })

  const messagesProcessed = await Promise.all(messagesProcessedPromise);

  return messagesProcessed;
}

const pollPromise = () => longPoller().then(response => {
  const { Messages } = response;

  if (!Messages)  {
    return 0
  }

  let mappedMessages
  try {
    mappedMessages = Messages.map((m) => {
      const { ReceiptHandle } = m;

      return { ...JSON.parse(m.Body), ReceiptHandle };
    })
  } catch (e) {
    console.error('no body')
    // throw new Error('unable to parse Body');
    return Infinity;
  }
  if (!mappedMessages) {
    console.error('no messages')
    // throw new Error('no messages');
    return 0;
  }
  //
  const messagesProcessedPromise = handleMessages(mappedMessages).catch(console.error);

  return messagesProcessedPromise.then(messages => messages.length);
})

const start = async () => {
  let promises = [Promise.resolve()];
  debugger

  while(await pollPromise() > 0) {
    debugger
    promises.push(pollPromise());
  }
  debugger
  Promise.all(promises).then(() => {
    debugger
    console.log('The queue is empty');
  });
}

start()
