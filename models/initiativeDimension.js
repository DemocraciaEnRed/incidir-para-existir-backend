// 'use strict';
const { Model, DataTypes } = require('sequelize');


module.exports = (sequelize) => {
  class InitiativeDimension extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  InitiativeDimension.init({
    initiativeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dimensionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    createdAt: false,
    updatedAt: false,
    modelName: 'InitiativeDimension',
    tableName: 'InitiativeDimensions',
  });

  return InitiativeDimension;
};