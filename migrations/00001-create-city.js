const {Sequelize} = require('sequelize')

module.exports = {
  async up({context: queryInterface}) {
    await queryInterface.createTable('Cities', {
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
      latitude: {
        type: Sequelize.DataTypes.DECIMAL(10, 8),
        allowNull: true,
      },
      longitude: {
        type: Sequelize.DataTypes.DECIMAL(11, 8),
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
    await queryInterface.bulkInsert('Cities', [
      // cali
      { 
        name: 'Cali',
        latitude: 3.451647,
        longitude: -76.531982
      },
      // bogota
      { 
        name: 'Bogota',
        latitude: 4.710989,
        longitude: -74.072090
       },
    ]);
  },
  async down({context: queryInterface}) {
    await queryInterface.dropTable('Cities');
  }
};