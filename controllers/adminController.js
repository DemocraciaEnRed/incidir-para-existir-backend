const { faker } = require('@faker-js/faker');
const models = require('../models');
const dayjs = require('dayjs');
const msg = require('../utils/messages');
const UtilsHelper = require('../helpers/utilsHelper');
const { Op } = require('sequelize');
// json2csv
const { Parser } = require('json2csv');

exports.getStats = async (req, res) => {
  try {
    const stats = {
      totalUsers: await models.User.count(),
      usersVerified: await models.User.count({ where: { emailVerified: true } }),
      usersNotVerified: 0,
      totalEntries: await models.BlogEntry.count(),
      totalChallenges: await models.Challenge.count(),
      totalInitiatives: await models.Initiative.count(),
      totalInitiativesPublished: await models.Initiative.count({ where: { publishedAt: { [Op.ne]: null } } }),
      totalInitiativesUnpublished: 0,
    }

    stats.usersNotVerified = stats.totalUsers - stats.usersVerified;
    stats.totalInitiativesUnpublished = stats.totalInitiatives - stats.totalInitiativesPublished;

    return res.status(200).json(stats);

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: msg.error.default })
  }
}

exports.getInitiativesCsv = async (req, res) => {
  try {
    const initiatives = await models.Initiative.findAll({
      include: [
        {
          model: models.User,
          as: 'author',
          attributes: ['email'],
        },
        {
          model: models.InitiativeContact,
          as: 'contact',
          attributes: ['fullname', 'email', 'phone'],
        },
        {
          model: models.Subdivision,
          as: 'subdivision',
          attributes: ['id', 'type', 'name'],
          include: [
            {
              model: models.City,
              as: 'city',
              attributes: ['id','name'],
            }
          ]
        },
        {
          model: models.Dimension,
          as: 'dimensions',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
    });

    const fields = [
      {
        label: 'iniciativaId',
        value: 'id',
      },
      {
        label: 'fuente',
        value: 'source',
        default: 'web'
      },
      {
        label: 'fechaCreacion',
        value: (row) => dayjs(row.createdAt).toISOString(),
      },
      {
        label: 'fechaActualizacion',
        value: (row) => dayjs(row.updatedAt).toISOString(),
      },
      {
        label: 'fechaPublicacion',
        value:  (row) => dayjs(row.updatedAt).toISOString(),
      },
      {
        label: 'fuente',
        value: 'source',
      },
      {
        label: 'contactoNombreCompleto',
        value: 'contact.fullname',
      },
      {
        label: 'contactoEmail',
        value: 'contact.email',
      },
      {
        label: 'contactoTelefono',
        value: 'contact.phone',
      },
      {
        label: 'ciudadId',
        value: 'subdivision.city.id',
      },
      {
        label: 'ciudadNombre',
        value: 'subdivision.city.name',
      },
      {
        label: 'subdivisionId',
        value: 'subdivision.id'
      },
      {
        label: 'subdivisionNombre',
        value: 'subdivision.name',
      },
      {
        label: 'subdivisionTipo',
        value: 'subdivision.type',
      },
      {
        label: 'latitude',
        value: (row) => row.latitude ? row.latitude.toString() : null
      },
      {
        label: 'longitude',
        value: (row) => row.longitude ? row.longitude.toString() : null
      },
      {
        label: 'ejeTematico01Id',
        value: 'dimensions[0].id', 
      },
      {
        label: 'ejeTematico01Nombre',
        value: 'dimensions[0].name', 
      },
      {
        label: 'ejeTematico02Id',
        value: 'dimensions[1].id', 
      },
      {
        label: 'ejeTematico02Nombre',
        value: 'dimensions[1].name', 
      },
      {
        label: 'nombre',
        value: 'name',
      },
      {
        label: 'descripcion',
        value: 'description',
      },
      {
        label: 'necesidadesYOfertas',
        value: 'needsAndOffers',
      },
    ];

    const opts = { fields, defaultValue: 'NULL' };

    const parser = new Parser(opts);
    const csv = parser.parse(initiatives);

    const timestamp = dayjs().format('YYYYMMDD_HHmmss');
    const filename = `${timestamp}_iniciativas_admin_export.csv`;

    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csv);
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: msg.error.default })
  }
}

exports.getChallengesCsv = async (req, res) => {
  try {
    const challenges = await models.Challenge.findAll({
      include: [
        {
          model: models.Subdivision,
          as: 'subdivision',
          attributes: ['id', 'type', 'name'],
          include: [
            {
              model: models.City,
              as: 'city',
              attributes: ['id','name'],
            }
          ]
        },
        {
          model: models.Dimension,
          as: 'dimension',
          attributes: ['id', 'name'],
        },
      ],
    });

    const fields = [
      {
        label: 'reporteId',
        value: 'id',
      },
      {
        label: 'fuente',
        value: 'source',
      },
      {
        label: 'fechaCreacion',
        value: (row) => dayjs(row.createdAt).toISOString(),
      },
      {
        label: 'ciudadId',
        value: 'subdivision.city.id',
      },
      {
        label: 'ciudadNombre',
        value: 'subdivision.city.name',
      },
      {
        label: 'subdivisionId',
        value: 'subdivision.id'
      },
      {
        label: 'subdivisionNombre',
        value: 'subdivision.name',
      },
      {
        label: 'subdivisionTipo',
        value: 'subdivision.type',
      },
      {
        label: 'ejeTematicoId',
        value: 'dimension.id', 
      },
      {
        label: 'ejeTematicoNombre',
        value: 'dimension.name', 
      },
      {
        label: 'latitude',
        value: (row) => row.latitude ? row.latitude.toString() : null
      },
      {
        label: 'longitude',
        value: (row) => row.longitude ? row.longitude.toString() : null
      },
      {
        label: 'necesidadesYDesafios',
        value: 'needsAndChallenges',
      },
      {
        label: 'propuesta',
        value: 'proposal'
      },
      {
        label: 'enPalabras',
        value: 'inWords',
      },
    ]

    const opts = { fields, defaultValue: 'NULL' };

    const parser = new Parser(opts);
    
    const csv = parser.parse(challenges);

    const timestamp = dayjs().format('YYYYMMDD_HHmmss');
    const filename = `${timestamp}_desafios_admin_export.csv`;

    res.setHeader('Content-disposition', `attachment; filename=${filename}.csv`);
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csv);
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: msg.error.default })
  }
}