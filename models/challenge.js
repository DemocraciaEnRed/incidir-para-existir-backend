// 'use strict';
const { Model, DataTypes } = require('sequelize');


module.exports = (sequelize) => {
  class Challenge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Challenge.belongsTo(models.Dimension,{
        foreignKey: 'dimensionId',
        targetKey: 'id',
        as: 'dimension',
      });
      Challenge.belongsTo(models.Subdivision, {
        foreignKey: {
          name: 'subdivisionId',
          allowNull: false,
        },
        as: 'subdivision',
      });
    }
  }

  Challenge.init({
    dimensionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subdivisionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    needsAndChallenges: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    proposal: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    inWords: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: true,
    modelName: 'Challenge',
    tableName: 'Challenges',
  });

  return Challenge;
};