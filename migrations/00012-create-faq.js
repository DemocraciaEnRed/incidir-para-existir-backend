const {Sequelize} = require('sequelize')

module.exports = {
  async up({context: queryInterface}) {
    await queryInterface.createTable('Faqs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      order: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
      },
      question: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      answer: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false
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
    await queryInterface.dropTable('Faqs');
  }
};