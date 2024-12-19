const { Sequelize } = require('sequelize')

module.exports = {
  async up({context: queryInterface}) {
    await queryInterface.createTable('Challenges', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      dimensionId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Dimensions',
          key: 'id'
        }
      },
      subdivisionId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Subdivisions',
          key: 'id'
        }
      },
      needsAndChallenges: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      proposal: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      inWords: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.fn('now'),
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.fn('now'),
        allowNull: false,
      }
    });
  },
  async down({context: queryInterface}) {
    await queryInterface.dropTable('Challenges');
  }
};