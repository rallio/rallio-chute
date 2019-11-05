const {pollMessages} = require('../app/poll-messages')
// const {
//   createQueue
// } = require('../../util/sqs/create-queue')
const {createQueue} = require('../util/sqs/create-queue')
// var assert = require('assert')

describe('when a queue has items in it', () => {
  let queue = {
    Messages: [
      {
          MessageId:"858151f2-8c72-4f11-9e7c-78c361a27a5d",
          ReceiptHandle:"AQEBOf58fAur4yovjSYhNj4zv5Mlat1bqoLj2fGhJI94aAYT4qF4rlO7EOlFD0ANZHs06UeKRB/rXrL7D7uh8kHgp1FdPlJTLyvAYoYZpHcchUaNC5cRGOVLXwHqyF1eclNvfQ6fXYBqO4I+yIo44L+bF64UP3RzBrkIe+c5tsO+ifO7gd4ITy7AZThVjng2JfXb3X+toA+/QL+Lm3arla2S46lLUZkFA18lvp5NMqiSIagXC//kMwnKFQq5D6vFfNnZFqyPlxSEjlEAZXqjiIuDXv1RvHOdsw3H/xlP+kuaNHdwS8fmzTYlokl4Ko9ll3VbYiwNyMs9VvpmaKcgBQe+UnTD/KFzmMQ5zAyMa9rtOMEqVIw880J4w4DNEP4Iqel5Emfd8CiFfqVM1rsP4CSAiFvntsQAphBT9Crp7DKTeao=",
          Body: '{"account_id":1,"account_name":"Bean Me Up LA","franchisor_id":null,"franchisor_name":null,"photo_id":79,"photo_liked_at":"2019-10-24T16:30:04Z","photo_liked_by_user_id":3,"photo_liked_by_user_name":"Kristen Alford","photo_tags":"animal,mammal,wildlife,lion","photo_url":"https://res.cloudinary.com/ralliohq/q_auto/xoufxsjggrwqxp8jggfx.jpg"}'
      }
    ]
  }

  let longPoller = () => new Promise(function(resolve) {
    return resolve(queue)
  })

  let removeFromSqs = () => new Promise(function(resolve) {
    const sqsResponse = {
      RequestId:"29c1149d-e964-5bd7-a217-42b1fc11cc18"
    }
    return resolve(sqsResponse)
 })

    let handleMessages = function() {
    return [{
      account_id:1,
      account_name:"Bean Me Up LA",
      franchisor_id:null,
      franchisor_name:null,
      MessageId:"858151f2-8c72-4f11-9e7c-78c361a27a5d",
      photo_id:79,
      photo_liked_at:"2019-10-24T21:36:27Z",
      photo_liked_by_user_id:3,
      photo_liked_by_user_name:"Kristen Alford",
      photo_tags:"animal,mammal,pet,dog,canine,golden retriever,vehicle,car,transportation,pets",
      photo_url:"https://res.cloudinary.com/ralliohq/e_improve/x_14,y_989,w_3199,h_2042,c_crop/q_auto/zghqoszspuxxgq7b7ioi.jpg",
      ReceiptHandle:"AQEBOf58fAur4yovjSYhNj4zv5Mlat1bqoLj2fGhJI94aAYT4qF4rlO7EOlFD0ANZHs06UeKRB/rXrL7D7uh8kHgp1FdPlJTLyvAYoYZpHcchUaNC5cRGOVLXwHqyF1eclNvfQ6fXYBqO4I+yIo44L+bF64UP3RzBrkIe+c5tsO+ifO7gd4ITy7AZThVjng2JfXb3X+toA+/QL+Lm3arla2S46lLUZkFA18lvp5NMqiSIagXC//kMwnKFQq5D6vFfNnZFqyPlxSEjlEAZXqjiIuDXv1RvHOdsw3H/xlP+kuaNHdwS8fmzTYlokl4Ko9ll3VbYiwNyMs9VvpmaKcgBQe+UnTD/KFzmMQ5zAyMa9rtOMEqVIw880J4w4DNEP4Iqel5Emfd8CiFfqVM1rsP4CSAiFvntsQAphBT9Crp7DKTeao="
    }]
  }

  it('removes from queue', async () => {
    let {
      QueueUrl
    } = await createQueue({
      QueueName: 'util-sqs-send-message'
    }).catch(err => err)

    const messageCount = await pollMessages({
      QueueUrl,
      poller: longPoller,
      remove: removeFromSqs,
      handle: handleMessages,
      sendToChute: () => Promise.resolve({}),
    })

    expect(typeof messageCount).toBe('number')
  })
})