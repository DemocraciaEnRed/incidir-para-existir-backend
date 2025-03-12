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
      cityId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Cities',
          key: 'id'
        }
      },
      subdivisionId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Subdivisions',
          key: 'id'
        }
      },
      source: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 'web'
      },
      latitude: {
        type: Sequelize.DataTypes.DECIMAL(10, 8),
        allowNull: true,
      },
      longitude: {
        type: Sequelize.DataTypes.DECIMAL(11, 8),
        allowNull: true,
      },
      needsAndChallenges: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      proposal: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      inWords: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      customCity: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
        allowNull: true,
      },
      customSubdivision: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
        allowNull: true,
      },
      extra: {
        type: Sequelize.DataTypes.JSON,
        defaultValue: null,
        allowNull: true,
      },
      publishedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
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