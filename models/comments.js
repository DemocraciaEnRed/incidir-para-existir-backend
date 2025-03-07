// 'use strict';
const { Model, DataTypes } = require('sequelize');


module.exports = (sequelize) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.User, {
        foreignKey: 'authorId',
        targetKey: 'id',
        as: 'author',
      });
      Comment.belongsTo(models.BlogEntry, {
        foreignKey: 'blogEntryId',
        targetKey: 'id',
        as: 'blogEntry',
      });
      // replies
      Comment.hasMany(models.Comment, {
        foreignKey: 'commentId',
        sourceKey: 'id',
        as: 'replies',
      });
      Comment.belongsTo(models.Comment, {
        foreignKey: 'commentId',
        targetKey: 'id',
        as: 'comment',
      });
    }
  }

  Comment.init({
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    blogEntryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: true,
    modelName: 'Comment',
    tableName: 'Comments',
  });

  return Comment;
};