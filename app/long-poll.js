/* eslint-disable no-console */
const longPoller = require('./long-poller');

longPoller()
  .catch(console.error)
  .then((messages) => {
    messages.forEach(message => {
      // map message... send to the Requests table
      console.log('handle message', message)

      const { tags } = message;

      tags.forEach(tag => {
        // handle tag
        // send to chute
        console.log('handle tag', tag)
      })
    })
  })
