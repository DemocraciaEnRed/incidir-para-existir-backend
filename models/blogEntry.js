// 'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BlogEntry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BlogEntry.belongsTo(models.BlogCategory,{
        foreignKey: 'categoryId',
        as: 'category'
      })
      BlogEntry.belongsTo(models.BlogSection,{
        foreignKey: 'sectionId',
        as: 'section'
      })
    }
  }
  BlogEntry.init({
    sectionId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    text: DataTypes.TEXT,
    imageUrl: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      },
      allowNull: true
    }
  }, {
    sequelize,
    timestamps: true,
    modelName: 'BlogEntry',
    tableName: 'BlogEntries',
  });
  return BlogEntry;
};