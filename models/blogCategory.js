// 'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BlogCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BlogCategory.hasMany(models.BlogEntry, {
        foreignKey: 'categoryId',
      })
    }
  }
  BlogCategory.init({
    name: DataTypes.STRING,        
  }, {
    sequelize,
    timestamps: true,
    modelName: 'BlogCategory',
    tableName: 'BlogCategories',
  });
  return BlogCategory;
};