async function getTags(data) {
    // console.log("######data.Messages", data)
    const message_id = data.MessageId
    const receiptHandle = data.ReceiptHandle
    const likedPhoto = JSON.parse(data.Body);
    // console.log("#####likedPhoto", likedPhoto.tags)
    const tags = likedPhoto.tags.slice(',');
    const mappedTags = tags.map((tag) => {
    // console.log("#####tag", tag)
      return {
        tag: tag,
        file_url: likedPhoto.url,
        account_id: likedPhoto.account_id,
        franchisor_id: likedPhoto.franchisor_id,
        photo_id: likedPhoto.photo_id,
        receiptHandle: receiptHandle,
        message_id: message_id
      }
    });
    return mappedTags;
  }
module.exports = { getTags };