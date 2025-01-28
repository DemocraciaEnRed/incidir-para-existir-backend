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
    await queryInterface.bulkInsert('Subdivisions', [
      // cityId = 1 Cali
      //    Comuna 1
      //    Comuna 2
      //    Comuna 3
      //    Comuna 4
      //    Comuna 5
      //    Comuna 6
      //    Comuna 7
      //    Comuna 8
      //    Comuna 9
      //    Comuna 10
      //    Comuna 11
      //    Comuna 12
      //    Comuna 13
      //    Comuna 14
      //    Comuna 15
      //    Comuna 16
      //    Comuna 17
      //    Comuna 18
      //    Comuna 19
      //    Comuna 20
      //    Comuna 21
      //    Comuna 22
      {
        cityId: 1,
        name: 'Nro. 1',
        type: 'Comuna',
        latitude: 3.45779005,
        longitude: -76.55587993102515
      },
      {
        cityId: 1,
        name: 'Nro. 2',
        type: 'Comuna',
        latitude: 3.4722467999999997,
        longitude: -76.5231426669844
      },
      {
        cityId: 1,
        name: 'Nro. 3',
        type: 'Comuna',
        latitude: 3.450471,
        longitude: -76.53583737828623
      },
      {
        cityId: 1,
        name: 'Nro. 4',
        type: 'Comuna',
        latitude: 3.4710367499999997,
        longitude: -76.51030326733553
      },
      {
        cityId: 1,
        name: 'Nro. 5',
        type: 'Comuna',
        latitude: 3.4733299,
        longitude: -76.49511366563675
      },
      {
        cityId: 1,
        name: 'Nro. 6',
        type: 'Comuna',
        latitude: 3.48590585,
        longitude: -76.48835137811889
      },
      {
        cityId: 1,
        name: 'Nro. 7',
        type: 'Comuna',
        latitude: 3.45568305,
        longitude: -76.49308358805617
      },
      {
        cityId: 1,
        name: 'Nro. 8',
        type: 'Comuna',
        latitude: 3.44605405,
        longitude: -76.50402867697812
      },
      {
        cityId: 1,
        name: 'Nro. 9',
        type: 'Comuna',
        latitude: 3.44250475,
        longitude: -76.52508232781814
      },
      {
        cityId: 1,
        name: 'Nro. 10',
        type: 'Comuna',
        latitude: 3.4204418,
        longitude: -76.528196223733
      },
      {
        cityId: 1,
        name: 'Nro. 11',
        type: 'Comuna',
        latitude: 3.4209841,
        longitude: -76.51368216695283
      },
      {
        cityId: 1,
        name: 'Nro. 12',
        type: 'Comuna',
        latitude: 3.43411915,
        longitude: -76.50345173774373
      },
      {
        cityId: 1,
        name: 'Nro. 13',
        type: 'Comuna',
        latitude: 3.4279986,
        longitude: -76.49158629896777
      },
      {
        cityId: 1,
        name: 'Nro. 14',
        type: 'Comuna',
        latitude: 3.4265621,
        longitude: -76.47616592465849
      },
      {
        cityId: 1,
        name: 'Nro. 15',
        type: 'Comuna',
        latitude: 3.4040350000000004,
        longitude: -76.50282783466317
      },
      {
        cityId: 1,
        name: 'Nro. 16',
        type: 'Comuna',
        latitude: 3.4039486500000002,
        longitude: -76.51550315841672
      },
      {
        cityId: 1,
        name: 'Nro. 17',
        type: 'Comuna',
        latitude: 3.38612865,
        longitude: -76.52934147410407
      },
      {
        cityId: 1,
        name: 'Nro. 18',
        type: 'Comuna',
        latitude: 3.38135245,
        longitude: -76.55208415983222
      },
      {
        cityId: 1,
        name: 'Nro. 19',
        type: 'Comuna',
        latitude: 3.4225870499999997,
        longitude: -76.54384051089963
      },
      {
        cityId: 1,
        name: 'Nro. 20',
        type: 'Comuna',
        latitude: 3.42015195,
        longitude: -76.56050099272197
      },
      {
        cityId: 1,
        name: 'Nro. 21',
        type: 'Comuna',
        latitude: 3.42437175,
        longitude: -76.46429513675527
      },
      {
        cityId: 1,
        name: 'Nro. 22',
        type: 'Comuna',
        latitude: 3.3536100500000003,
        longitude: -76.53522808093732
      },
      // cityId = 1 Cali
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
        name: 'El Hormiguero',
        type: 'Corregimiento',
        latitude: 3.3267755,
        longitude: -76.49091857697078
      },
      {
        cityId: 1,
        name: 'El Saladito',
        type: 'Corregimiento',
        latitude: 3.48669605,
        longitude: -76.61284193429866
      },
      {
        cityId: 1,
        name: 'Felidia',
        type: 'Corregimiento',
        latitude: 3.4464145,
        longitude: -76.68761171389792
      },
      {
        cityId: 1,
        name: 'Golondrinas',
        type: 'Corregimiento',
        latitude: 3.4832839,
        longitude: -76.53876372774263
      },
      {
        cityId: 1,
        name: 'La Buitrera',
        type: 'Corregimiento',
        latitude: 3.378927,
        longitude: -76.57978249566546
      },
      {
        cityId: 1,
        name: 'La Castilla',
        type: 'Corregimiento',
        latitude: 3.4898991500000003,
        longitude: -76.57944486910714
      },
      {
        cityId: 1,
        name: 'La Elvira',
        type: 'Corregimiento',
        latitude: 3.5205423,
        longitude: -76.60252936637318
      },
      {
        cityId: 1,
        name: 'La Leonera',
        type: 'Corregimiento',
        latitude: 3.4346287,
        longitude: -76.67481819888228
      },
      {
        cityId: 1,
        name: 'La Paz',
        type: 'Corregimiento',
        latitude: 3.5134931,
        longitude: -76.57037515316091
      },
      {
        cityId: 1,
        name: 'Los Andes',
        type: 'Corregimiento',
        latitude: 3.4113257499999996,
        longitude: -76.61192249177066
      },
      {
        cityId: 1,
        name: 'Montebello',
        type: 'Corregimiento',
        latitude: 3.47570165,
        longitude: -76.55086954008621
      },
      {
        cityId: 1,
        name: 'Navarro',
        type: 'Corregimiento',
        latitude: 3.40298675,
        longitude: -76.48760583229188
      },
      {
        cityId: 1,
        name: 'Pance',
        type: 'Corregimiento',
        latitude: 3.32287445,
        longitude: -76.60963729700222
      },
      {
        cityId: 1,
        name: 'Pichindé',
        type: 'Corregimiento',
        latitude: 3.43133015,
        longitude: -76.6574321905346
      },
      {
        cityId: 1,
        name: 'Villacarmelo',
        type: 'Corregimiento',
        latitude: 3.37998325,
        longitude: -76.62569317175624
      },
      // cityId = 2 Bogota
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
        latitude: 4.71326,
        longitude: -74.0436668
      },
      {
        cityId: 2,
        name: 'Chapinero',
        type: 'Localidad',
        latitude:	4.6572183,
        longitude: -74.0464327
      },
      {
        cityId: 2,
        name: 'Santa Fe',
        type: 'Localidad',
        latitude:	4.6108451,
        longitude: -74.0682581
      },
      {
        cityId: 2,
        name: 'San Cristóbal',
        type: 'Localidad',
        latitude: 4.5584546,
        longitude: -74.0887201
      },
      {
        cityId: 2,
        name: 'Usme',
        type: 'Localidad',
        latitude: 4.4736476,
        longitude: -74.1108003
      },
      {
        cityId: 2,
        name: 'Tunjuelito',
        type: 'Localidad',
        latitude: 4.5728957,
        longitude: -74.1343045
      },
      {
        cityId: 2,
        name: 'Bosa',
        type: 'Localidad',
        latitude: 4.6180154,
        longitude: -74.1942955
      },
      {
        cityId: 2,
        name: 'Kennedy',
        type: 'Localidad',
        latitude: 4.6314954,
        longitude: -74.1489905
      },
      {
        cityId: 2,
        name: 'Fontibón',
        type: 'Localidad',
        latitude: 4.6750557,
        longitude: -74.1326619
      },
      {
        cityId: 2,
        name: 'Engativá',
        type: 'Localidad',
        latitude: 4.7091733,
        longitude: -74.1102855
      },
      {
        cityId: 2,
        name: 'Suba',
        type: 'Localidad',
        latitude: 4.7405408,
        longitude: -74.0841442
      },
      {
        cityId: 2,
        name: 'Barrios Unidos',
        type: 'Localidad',
        latitude: 4.6643895,
        longitude: -74.074969
      },
      {
        cityId: 2,
        name: 'Teusaquillo',
        type: 'Localidad',
        latitude: 4.6415843,
        longitude: -74.0857995
      },
      {
        cityId: 2,
        name: 'Los Mártires',
        type: 'Localidad',
        latitude: 4.6048283,
        longitude: -74.0854715
      },
      {
        cityId: 2,
        name: 'Antonio Nariño',
        type: 'Localidad',
        latitude: 4.5894711,
        longitude: -74.1046155
      },
      {
        cityId: 2,
        name: 'Puente Aranda',
        type: 'Localidad',
        latitude: 4.6144148,
        longitude: -74.1072641
      },
      {
        cityId: 2,
        name: 'Candelaria',
        type: 'Localidad',
        latitude: 4.5968167,
        longitude: -74.0716669
      },
      {
        cityId: 2,
        name: 'Rafael Uribe',
        type: 'Localidad',
        latitude: 4.565019,
        longitude: -74.1144401
      },
      {
        cityId: 2,
        name: 'Ciudad Bolívar',
        type: 'Localidad',
        latitude: 4.5658158,
        longitude: -74.1617918
      }
    ]);
  },
  async down({context: queryInterface}) {
    await queryInterface.dropTable('Subdivisions');
  }
};