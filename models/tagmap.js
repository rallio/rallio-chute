
module.exports = (sequelize, DataTypes) => {
  const TagMap = sequelize.define('TagMap', {
    album_code: DataTypes.INTEGER,
    tag: DataTypes.STRING
  }, {});
  TagMap.associate = function() {
    // associations can be defined here
  };
  return TagMap;
};
