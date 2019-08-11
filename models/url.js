'use strict';
module.exports = (sequelize, DataTypes) => {
  const Url = sequelize.define('Url', {
    id: DataTypes.INTEGER,
    base: DataTypes.STRING,
    cusrom: DataTypes.STRING,
    shorten: DataTypes.STRING,
    created_on: DataTypes.STRING,
    updated_on: DataTypes.STRING
  }, {});
  Url.associate = function(models) {
    // associations can be defined here
  };
  return Url;
};