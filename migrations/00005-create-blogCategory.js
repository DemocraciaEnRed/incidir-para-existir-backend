const {Sequelize} = require('sequelize')

module.exports = {
  async up({context: queryInterface}) {
    await queryInterface.createTable('BlogCategories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      name: {
        type: Sequelize.DataTypes.STRING,
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
    await queryInterface.bulkInsert('BlogCategories', [
      { name: 'Economia', },
      { name: 'Politica', },
      { name: 'Deportes', },
      { name: 'Cultura', },
      { name: 'Tecnologia', },
      { name: 'Entretenimiento', },
    ]);
  },
  async down({context: queryInterface}) {
    await queryInterface.dropTable('BlogCategories');
  }
};