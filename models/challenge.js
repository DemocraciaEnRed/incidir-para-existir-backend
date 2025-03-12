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
      Challenge.belongsTo(models.City, {
        foreignKey: {
          name: 'cityId',
          allowNull: true,
        },
        as: 'city',
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
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    subdivisionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'web',
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
      get() {
        return parseFloat(this.getDataValue('latitude'));
      },
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
      get() {
        return parseFloat(this.getDataValue('longitude'));
      },      
    },
    needsAndChallenges: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    proposal: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    inWords: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    customCity: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
    },
    customSubdivision: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
    },
    extra: {
      type: DataTypes.TEXT,
      defaultValue: null,
      allowNull: true,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  }, {
    sequelize,
    timestamps: true,
    modelName: 'Challenge',
    tableName: 'Challenges',
  });

  return Challenge;
};