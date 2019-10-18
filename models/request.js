'use strict';
module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    album: DataTypes.STRING,
    url: DataTypes.STRING,
    account_id: DataTypes.INTEGER,
    franchisor_id: DataTypes.INTEGER,
    photo_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    receipt_handle: DataTypes.STRING,
    message_id: DataTypes.STRING,
    request_success: DataTypes.BOOLEAN,
    tag: DataTypes.STRING
  }, {});
  Request.associate = function(models) {
    // associations can be defined here
  };
  return Request;
};
