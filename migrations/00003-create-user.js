const { Sequelize } = require('sequelize')

module.exports = {
  async up({context: queryInterface}) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      firstName: {
        type: Sequelize.DataTypes.STRING
      },
      lastName: {
        type: Sequelize.DataTypes.STRING
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: 'user',
        allowNull: false,
      },
      subdivisionId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: 'Subdivisions',
          },
          key: 'id'
        }
      },
      emailVerified: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      verifiedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
      lastLogin: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
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
    await queryInterface.dropTable('Users');
  }
};