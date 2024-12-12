'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dimension extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Dimension.belongsToMany(models.Initiative, {
        through: 'InitiativeDimensions',
        foreignKey: 'dimensionId',
        sourceKey: 'id',
        timestamps: false,
        as: 'initiatives',
      })
    }
  }
  Dimension.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    timestamps: true,
    modelName: 'Dimension',
    tableName: 'Dimensions',
  });
  return Dimension;
};