const {Sequelize} = require('sequelize')

module.exports = {
  async up({context: queryInterface}) {
    await queryInterface.createTable('Members', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      fullname: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      team: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      bio: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false
      },
      imageUrl: {
        type: Sequelize.DataTypes.STRING(510),
        allowNull: true
      },
      linkedin: {
        type: Sequelize.DataTypes.STRING(510),
        allowNull: true
      },
      twitter: {
        type: Sequelize.DataTypes.STRING(510),
        allowNull: true
      },
      instagram: {
        type: Sequelize.DataTypes.STRING(510),
        allowNull: true
      },
      tiktok: {
        type: Sequelize.DataTypes.STRING(510),
        allowNull: true
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
    await queryInterface.dropTable('Members');
  }
};