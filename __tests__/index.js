const {start} = require('../app/index')

describe('when a queue has no items in it', () => {
    it('processedMessagesCount is 0 ', async () => {
       const counts = await start()
       const { processedMessagesCount } = counts
       expect(processedMessagesCount).toBe(0)
      
    })
    it('pollcount is 0 ', async () => {
        const counts = await start()
        const { pollCount } = counts
        expect(pollCount).toBe(0)
       
     })
})