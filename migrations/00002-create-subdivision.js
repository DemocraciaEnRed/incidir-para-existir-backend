const {Sequelize} = require('sequelize')

module.exports = {
  async up({context: queryInterface}) {
    await queryInterface.createTable('Subdivisions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      cityId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Cities',
          key: 'id'
        }
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      type: {
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
    await queryInterface.bulkInsert('Subdivisions', [
      // cityId = 1
      //    Corregimiento El Hormiguero
      //    Corregimiento El Saladito
      //    Corregimiento Felidia
      //    Corregimiento Golondrinas
      //    Corregimiento La Buitrera
      //    Corregimiento La Castilla
      //    Corregimiento La Elvira
      //    Corregimiento La Leonera
      //    Corregimiento La Paz
      //    Corregimiento Los Andes
      //    Corregimiento Montebello
      //    Corregimiento Navarro
      //    Corregimiento Pance
      //    Corregimiento Pichindé
      //    Corregimiento Villacarmelo
      {
        cityId: 1,
        name: 'Corregimiento El Hormiguero',
        type: 'Comuna',
      },
      {
        cityId: 1,
        name: 'Corregimiento El Saladito',
        type: 'Comuna',
      },
      {
        cityId: 1,
        name: 'Corregimiento Felidia',
        type: 'Comuna',
      },
      {
        cityId: 1,
        name: 'Corregimiento Golondrinas',
        type: 'Comuna',
      },
      {
        cityId: 1,
        name: 'Corregimiento La Buitrera',
        type: 'Comuna',
      },
      {
        cityId: 1,
        name: 'Corregimiento La Castilla',
        type: 'Comuna',
      },
      {
        cityId: 1,
        name: 'Corregimiento La Elvira',
        type: 'Comuna',
      },
      {
        cityId: 1,
        name: 'Corregimiento La Leonera',
        type: 'Comuna',
      },
      {
        cityId: 1,
        name: 'Corregimiento La Paz',
        type: 'Comuna',
      },
      {
        cityId: 1,
        name: 'Corregimiento Los Andes',
        type: 'Comuna',
      },
      {
        cityId: 1,
        name: 'Corregimiento Montebello',
        type: 'Comuna',
      },
      {
        cityId: 1,
        name: 'Corregimiento Navarro',
        type: 'Comuna',
      },
      {
        cityId: 1,
        name: 'Corregimiento Pance',
        type: 'Comuna',
      },
      {
        cityId: 1,
        name: 'Corregimiento Pichindé',
        type: 'Comuna',
      },
      {
        cityId: 1,
        name: 'Corregimiento Villacarmelo',
        type: 'Comuna',
      },
      // cityId = 2
      //    Usaquén
      //    Chapinero
      //    Santa Fe
      //    San Cristóbal
      //    Usme
      //    Tunjuelito
      //    Bosa
      //    Kennedy
      //    Fontibón
      //    Engativá
      //    Suba
      //    Barrios Unidos
      //    Teusaquillo
      //    Los Mártires
      //    Antonio Nariño
      //    Puente Aranda
      //    Candelaria
      //    Rafael Uribe
      //    Ciudad Bolívar
      //    Sumapaz
      {
        cityId: 2,
        name: 'Usaquén',
        type: 'Localidad',
      },
      {
        cityId: 2,
        name: 'Chapinero',
        type: 'Localidad',
      },
      {
        cityId: 2,
        name: 'Santa Fe',
        type: 'Localidad',
      },
      {
        cityId: 2,
        name: 'San Cristóbal',
        type: 'Localidad',
      },
      {
        cityId: 2,
        name: 'Usme',
        type: 'Localidad',
      },
      {
        cityId: 2,
        name: 'Tunjuelito',
        type: 'Localidad',
      },
      {
        cityId: 2,
        name: 'Bosa',
        type: 'Localidad',
      },
      {
        cityId: 2,
        name: 'Kennedy',
        type: 'Localidad',
      },
      {
        cityId: 2,
        name: 'Fontibón',
        type: 'Localidad',
      },
      {
        cityId: 2,
        name: 'Engativá',
        type: 'Localidad',
      },
      {
        cityId: 2,
        name: 'Suba',
        type: 'Localidad',
      },
      {
        cityId: 2,
        name: 'Barrios Unidos',
        type: 'Localidad',
      },
      {
        cityId: 2,
        name: 'Teusaquillo',
        type: 'Localidad',
      },
      {
        cityId: 2,
        name: 'Los Mártires',
        type: 'Localidad',
      },
      {
        cityId: 2,
        name: 'Antonio Nariño',
        type: 'Localidad',
      },
      {
        cityId: 2,
        name: 'Puente Aranda',
        type: 'Localidad',
      },
      {
        cityId: 2,
        name: 'Candelaria',
        type: 'Localidad',
      },
      {
        cityId: 2,
        name: 'Rafael Uribe',
        type: 'Localidad',
      },
      {
        cityId: 2,
        name: 'Ciudad Bolívar',
        type: 'Localidad',
      }
    ]);
  },
  async down({context: queryInterface}) {
    await queryInterface.dropTable('Subdivisions');
  }
};