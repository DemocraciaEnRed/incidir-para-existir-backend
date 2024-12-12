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
    type: DataTypes.STRING
  }, {
    sequelize,
    timestamps: true,
    modelName: 'Subdivision',
    tableName: 'Subdivisions',
  });
  return Subdivision;
};