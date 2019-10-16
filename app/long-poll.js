const longPoller = require('./long-poller');

longPoller()
.catch(console.error)
.then((messages) => {
  messages.forEach(message => {
    // map message... send to the Requests table

    const { tags } = message;

    tags.forEach(tag => {
      // handle tag
      // send to chute
    })
  })
})
