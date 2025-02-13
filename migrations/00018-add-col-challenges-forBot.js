const {Sequelize} = require('sequelize')

module.exports = {
  async up({context: queryInterface}) {
    await queryInterface.addColumn('Challenges', 'customCity', {
      type: Sequelize.DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
      after: 'inWords',
    });
    await queryInterface.addColumn('Challenges', 'customSubdivision', {
      type: Sequelize.DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
      after: 'customCity',
    });
    await queryInterface.addColumn('Challenges', 'extra', {
      type: Sequelize.DataTypes.TEXT,
      defaultValue: null,
      allowNull: true,
      after: 'customSubdivision',
    });
  },
  async down({context: queryInterface}) {
    await queryInterface.removeColumn('Challenges', 'customCity');
    await queryInterface.removeColumn('Challenges', 'customSubdivision');
    await queryInterface.removeColumn('Challenges', 'extra');
  }
};