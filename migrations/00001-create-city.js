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
      southWestLatitude: {
        type: Sequelize.DataTypes.DECIMAL(10, 8),
        allowNull: true,
      },
      southWestLongitude: {
        type: Sequelize.DataTypes.DECIMAL(11, 8),
        allowNull: true,
      },
      northEastLatitude: {
        type: Sequelize.DataTypes.DECIMAL(10, 8),
        allowNull: true,
      },
      northEastLongitude: {
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
        longitude: -76.531982,
        southWestLatitude: 3.2666614,
        southWestLongitude: -76.7944336,
        northEastLatitude: 3.7861514,
        northEastLongitude: -76.2574768
      },
      // bogota
      { 
        name: 'Bogotá',
        latitude: 4.710989,
        longitude: -74.072090,
        southWestLatitude: 4.4354132,
        southWestLongitude: -74.3479156,
        northEastLatitude: 4.9048868,
        northEastLongitude: -73.8761902
       },
    ]);
  },
  async down({context: queryInterface}) {
    await queryInterface.dropTable('Cities');
  }
};