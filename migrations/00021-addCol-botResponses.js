const {Sequelize} = require('sequelize')

module.exports = {
  async up({context: queryInterface}) {
    await queryInterface.addColumn('BotResponses', 'type', {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      after: 'payload',
    });
  },
  async down({context: queryInterface}) {
    await queryInterface.removeColumn('BotResponses', 'type');
  }
};