const {handleMessages} = require('../app/handle-messages')

describe('when message sent to handle message', () => { 
   let messages = [{
    account_id:1,
    account_name:"Bean Me Up LA",
    franchisor_id:null,
    franchisor_name:null,
    MessageId:"6494b0c1-b93e-4786-9e58-28c6a6e58293",
    photo_id:97,
    photo_liked_at:"2019-10-24T22:01:23Z",
    photo_liked_by_user_id:3,
    photo_liked_by_user_name:"Kristen Alford",
    photo_tags:"animal,mammal,pet",
    photo_url:"https://res.cloudinary.com/ralliohq/e_improve/x_14,y_989,w_3199,h_2042,c_crop/q_auto/zghqoszspuxxgq7b7ioi.jpg",
    ReceiptHandle:"AQEBX01TLQqicbc602FbiGPhTuJ1yglFd+ak4j60hzOTW00zNNKYoqhavat802FXN94VEmpOm0gGegAZ8LR9MBtRMMjMTEPPlNW/engIC/ZnOAph6OkxFEo4ba3HmMXf0GEVsQqUJcy1BZ6ksVClnRjcsY88UD5nYRu+JiqyRNn7XWUONw9bJGm0ueuQLH5X8gJM4oTDpXQvjT29U3C221Z9CcwTzrvyw/R1BxSUS76IprmTAsdlAkVQa5C8V+lubxmkEHO+I71jUChLzj4l/2Lqv2OCkkKsM3ekIpboRvCtNAw8uYiYVfbXsWABinM2sImvtbIvfTZ2MOliSbpNx7rraybKyepcuKan1eT1CuuE9XVydztraTeucvSP8v8HhiJa8uLiwOVCBrcm2AqT5eX4cMlmFRni8XPuYGjOchThaJk="
  }]

   async function checkDB(){ 
      return []
   }

   async function checkDBTrue(){ 
      return ["oneItem"]
   }

   async function sendToChute(){
      return Promise.resolve({
         code:201,
         href:"http://api.getchute.com/v2/albums/2691441/assets/upload",
         method:"POST",
         title:"AlbumAsset Details",
         version:2
      })
   }
 
   test('removes from queue', async () => {
      const messageResponse = await handleMessages({messages, checkDB, sendToChute})
   
      expect(messageResponse).toHaveLength(1)
   })

   test('removes from queue check existing true', async () => {
      const messageResponse = await handleMessages({ messages, checkDB: checkDBTrue, sendToChute})
   
      expect(messageResponse).toHaveLength(1)
   })
})