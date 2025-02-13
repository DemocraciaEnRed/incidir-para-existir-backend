// 'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ResourceCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ResourceCategory.hasMany(models.ResourceEntry, {
        foreignKey: 'categoryId',
      })
    }
  }
  ResourceCategory.init({
    name: DataTypes.STRING,        
  }, {
    sequelize,
    timestamps: true,
    modelName: 'ResourceCategory',
    tableName: 'ResourceCategories',
  });
  return ResourceCategory;
};