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
      key: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
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
      { key: 'educacion-calidad', name: 'Educación de calidad', },
      { key: 'empleo-digno', name: 'Empleo digno', },
      { key: 'espacios-publicos-seguros', name: 'Espacios públicos seguros', },
      { key: 'salud-integral', name: 'Salud Integral', },
      { key: 'participacion-politica-juvenil', name: 'Participación política juvenil', },
      { key: 'transporte-publico-digno', name: 'Transporte público digno', },
      { key: 'ambiente-sano', name: 'Ambiente sano', },
      { key: 'ocio-cultura', name: 'Ocio y cultura', }
    ]);
  },
  async down({context: queryInterface}) {
    await queryInterface.dropTable('Dimensions');
  }
};