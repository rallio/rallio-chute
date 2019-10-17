require('dotenv').config();
const AWS = require('aws-sdk');

const apiVersion = process.env.API_VERSION;
const endpoint = process.env.AWS_DB_URL;
const accessKeyId = process.env.AWS_SQS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SQS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;

if (endpoint) {
  AWS.config.update({ endpoint });
}
if (accessKeyId) {
  AWS.config.update({ accessKeyId });
}
if (secretAccessKey) {
  AWS.config.update({ secretAccessKey });
}
if (region) {
  AWS.config.update({ region });
}

module.exports = () =>
  new AWS.SQS({ apiVersion });
