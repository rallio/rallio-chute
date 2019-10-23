'use strict';
module.exports = (sequelize, DataTypes) => {
  const LocationMap = sequelize.define('LocationMap', {
    album_code: DataTypes.INTEGER,
    account_id: DataTypes.INTEGER
  }, {});
  LocationMap.associate = function() {
    // associations can be defined here
  };
  return LocationMap;
};
