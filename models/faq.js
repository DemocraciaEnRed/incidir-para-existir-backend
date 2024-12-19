const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Faq extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Faq.init({
    name: DataTypes.STRING,
    order: DataTypes.NUMBER,
    question: DataTypes.STRING,
    answer: DataTypes.TEXT
  }, {
    sequelize,
    timestamps: true,
    modelName: 'Faq',
    tableName: 'Faqs',
  });
  return Faq;
};