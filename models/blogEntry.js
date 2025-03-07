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
      BlogEntry.belongsTo(models.User,{
        foreignKey: 'authorId',
        targetKey: 'id',
        as: 'author',
      });
      BlogEntry.belongsTo(models.BlogCategory,{
        foreignKey: 'categoryId',
        as: 'category'
      })
      BlogEntry.belongsTo(models.BlogSection,{
        foreignKey: 'sectionId',
        as: 'section'
      })
      BlogEntry.hasMany(models.Comment,{
        foreignKey: 'blogEntryId',
        sourceKey: 'id',
        as: 'comments'
      })
    }

    // instance method
    // get the total amount of comments and replies for this entry
    async getTotalCommentsAndRepliesCount() {
      const comments = await this.getComments({
        include: [{
          model: sequelize.models.Comment,
          as: 'replies'
        }]
      });

      let totalCount = comments.length;
      // console.log(totalCount)
      comments.forEach(comment => {
        totalCount += comment.replies.length;
      });

      return totalCount;
    }
  }
  BlogEntry.init({
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
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
    },
    authorNotifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  }, {
    sequelize,
    timestamps: true,
    modelName: 'BlogEntry',
    tableName: 'BlogEntries',
  });
  return BlogEntry;
};