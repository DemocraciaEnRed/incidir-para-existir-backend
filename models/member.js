const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Member.init({
    fullname: DataTypes.STRING,
    team: DataTypes.STRING,
    bio: DataTypes.TEXT,
    imageUrl: {
      type: DataTypes.STRING(510),
      validate: {
        isUrl: true
      },
      allowNull: true
    },
    linkedin: {
      type: DataTypes.STRING(510),
      allowNull: true
    },
    twitter: {
      type: DataTypes.STRING(510),
      allowNull: true
    },
    instagram: {
      type: DataTypes.STRING(510),
      allowNull: true
    },
    tiktok: {
      type: DataTypes.STRING(510),
      allowNull: true
    },
  }, {
    sequelize,
    timestamps: true,
    modelName: 'Member',
    tableName: 'Members',
  });
  return Member;
};