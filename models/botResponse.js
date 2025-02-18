const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {

  class BotResponse extends Model {

  }

  BotResponse.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    payload: {
      type: DataTypes.JSON,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'BotResponse',
    tableName: 'BotResponses',
    timestamps: true
  });

  return BotResponse;
};