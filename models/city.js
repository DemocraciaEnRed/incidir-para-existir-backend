const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      City.hasMany(models.Subdivision, {
        foreignKey: 'cityId',
        as: 'subdivisions'
      })
    }
  }
  City.init({
    name: DataTypes.STRING,
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
    southWestLatitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
      // get transform to decimal
      get() {
        return parseFloat(this.getDataValue('southWestLatitude'));
      },
    },
    southWestLongitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
      // get transform to decimal
      get() {
        return parseFloat(this.getDataValue('southWestLongitude'));
      },
    },
    northEastLatitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
      // get transform to decimal
      get() {
        return parseFloat(this.getDataValue('northEastLatitude'));
      },
    },
    northEastLongitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
      // get transform to decimal
      get() {
        return parseFloat(this.getDataValue('northEastLongitude'));
      },
    },
  }, {
    sequelize,
    timestamps: true,
    modelName: 'City',
    tableName: 'Cities',
  });
  return City;
};