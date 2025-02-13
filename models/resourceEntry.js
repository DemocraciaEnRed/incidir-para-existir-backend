// 'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ResourceEntry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ResourceEntry.belongsTo(models.ResourceCategory,{
        foreignKey: 'categoryId',
        as: 'category'
      })
    }
  }
  ResourceEntry.init({
    title: DataTypes.STRING,
    categoryId: DataTypes.INTEGER,
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    url: DataTypes.STRING(2048)
  }, {
    sequelize,
    timestamps: true,
    modelName: 'ResourceEntry',
    tableName: 'ResourceEntries',
  });
  return ResourceEntry;
};