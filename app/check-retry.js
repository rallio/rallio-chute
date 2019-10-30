async function checkRetry(messageIdExists) {
  return messageIdExists.length > 0;
}

module.exports = { checkRetry };