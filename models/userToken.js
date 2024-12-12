// 'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class UserToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserToken.belongsTo(models.User)
    }

  }

  UserToken.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    event: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    timestamps: true,
    updatedAt: false,
    modelName: 'UserToken',
    tableName: 'UserTokens',
  });

  return UserToken;
};