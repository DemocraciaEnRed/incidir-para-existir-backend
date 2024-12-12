const { Sequelize } = require('sequelize')

module.exports = {
  async up({context: queryInterface}) {
    await queryInterface.createTable('UserTokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      userId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      token: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      event: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.fn('now'),
        allowNull: false,
      },
      expiresAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      }
    }, {
      timestamps: true,
      updatedAt: false
    });
  },
  async down({context: queryInterface}) {
    await queryInterface.dropTable('UserTokens');
  }
};