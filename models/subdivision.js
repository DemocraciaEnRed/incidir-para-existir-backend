const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Subdivision extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Subdivision.belongsTo(models.City,{
        foreignKey: 'cityId',
        as: 'city'
      })
      Subdivision.hasMany(models.Initiative, {
        foreignKey: 'subdivisionId',
        as: 'initiatives'
      })
    }
  }
  Subdivision.init({
    cityId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
      // get transform to decimal
      get() {
        return parseFloat(this.getDataValue('latitude'));
      },
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
      // get transform to decimal
      get() {
        return parseFloat(this.getDataValue('longitude'));
      },
    },
  }, {
    sequelize,
    timestamps: true,
    modelName: 'Subdivision',
    tableName: 'Subdivisions',
  });
  return Subdivision;
};