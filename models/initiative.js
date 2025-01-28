// 'use strict';
const { Model, DataTypes } = require('sequelize');


module.exports = (sequelize) => {
  class Initiative extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Initiative.belongsTo(models.User,{
        foreignKey: 'authorId',
        targetKey: 'id',
        as: 'author',
      });
      Initiative.belongsTo(models.InitiativeContact, {
        foreignKey: {
          name: 'contactId',
          allowNull: false,
        },
        as: 'contact',
      });
      Initiative.belongsTo(models.Subdivision, {
        foreignKey: {
          name: 'subdivisionId',
          allowNull: false,
        },
        as: 'subdivision',
      });
      Initiative.belongsToMany(models.Dimension, {
        through: 'InitiativeDimensions',
        foreignKey: 'initiativeId',
        sourceKey: 'id',
        timestamps: false,
        as: 'dimensions',
      });
    }
  }

  Initiative.init({
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    contactId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subdivisionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'web',
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    needsAndOffers: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  }, {
    sequelize,
    timestamps: true,
    modelName: 'Initiative',
    tableName: 'Initiatives',
  });

  return Initiative;
};