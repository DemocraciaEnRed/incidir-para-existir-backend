'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BlogSection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BlogSection.hasMany(models.BlogEntry, {
        foreignKey: 'sectionId',
      })
    }
  }
  BlogSection.init({
    name: DataTypes.STRING,    
  }, {
    sequelize,
    timestamps: true,
    modelName: 'BlogSection',
    tableName: 'BlogSections',
  });
  return BlogSection;
};