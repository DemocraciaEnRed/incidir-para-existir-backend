const {Sequelize} = require('sequelize')

module.exports = {
  async up({context: queryInterface}) {
    await queryInterface.addColumn('BotResponses', 'success', {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      after: 'payload',
    });
    await queryInterface.addColumn('BotResponses', 'errorTrace', {
      type: Sequelize.DataTypes.JSON,
      allowNull: true,
      after: 'success',
    });
  },
  async down({context: queryInterface}) {
    await queryInterface.removeColumn('BotResponses', 'success');
    await queryInterface.removeColumn('BotResponses', 'errorTrace');
  }
};