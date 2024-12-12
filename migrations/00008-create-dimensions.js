const {Sequelize} = require('sequelize')

module.exports = {
  async up({context: queryInterface}) {
    await queryInterface.createTable('Dimensions', {
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
    await queryInterface.bulkInsert('Dimensions', [
      { name: 'Educación de calidad', },
      { name: 'Empleo digno', },
      { name: 'Espacios públicos seguros', },
      { name: 'Salud Integral', },
      { name: 'Participación política juvenil', },
      { name: 'Transporte público digno', },
      { name: 'Ambiente sano', },
      { name: 'Ocio y cultura', }
    ]);
  },
  async down({context: queryInterface}) {
    await queryInterface.dropTable('Dimensions');
  }
};