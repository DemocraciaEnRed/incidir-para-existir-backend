const {Sequelize} = require('sequelize')

module.exports = {
  async up({context: queryInterface}) {
    await queryInterface.addColumn('Initiatives', 'customCity', {
      type: Sequelize.DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
      after: 'needsAndOffers',
    });
    await queryInterface.addColumn('Initiatives', 'customSubdivision', {
      type: Sequelize.DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
      after: 'customCity',
    });
    await queryInterface.addColumn('Initiatives', 'extra', {
      type: Sequelize.DataTypes.TEXT,
      defaultValue: null,
      allowNull: true,
      after: 'customSubdivision',
    });
  },
  async down({context: queryInterface}) {
    await queryInterface.removeColumn('Initiatives', 'customCity');
    await queryInterface.removeColumn('Initiatives', 'customSubdivision');
    await queryInterface.removeColumn('Initiatives', 'extra');
  }
};