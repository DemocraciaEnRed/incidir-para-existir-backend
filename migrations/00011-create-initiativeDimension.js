const { Sequelize } = require('sequelize')

module.exports = {
  async up({context: queryInterface}) {
    await queryInterface.createTable('InitiativeDimensions', {
      initiativeId: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'Initiatives',
          key: 'id'
        }
      },
      dimensionId: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'Dimensions',
          key: 'id'
        }
      },
    });
  },
  async down({context: queryInterface}) {
    await queryInterface.dropTable('Initiatives');
  }
};