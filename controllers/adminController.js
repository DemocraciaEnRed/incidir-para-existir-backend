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
      usersNotVerified: await models.User.count({ where: { emailVerified: false } }),
      usersWhoHaveNotLoggedInIn30Days: await models.User.count({ where: { lastLogin: { [Op.lt]: dayjs().subtract(30, 'days').toDate() } } }),
      usersWhoHaveNotLoggedInIn60Days: await models.User.count({ where: { lastLogin: { [Op.lt]: dayjs().subtract(60, 'days').toDate() } } }),
      totalEntries: await models.BlogEntry.count(),
      totalEntriesPublished: await models.BlogEntry.count({ where: { publishedAt: { [Op.ne]: null } } }),
      totalEntriesNotPublished: await models.BlogEntry.count({ where: { publishedAt: { [Op.eq]: null } } }),
      totalEntriesComments: await models.Comment.count({ where: { commentId: { [Op.eq]: null } } }),
      totalEntriesReplies: await models.Comment.count({ where: { commentId: { [Op.ne]: null } } }),
      totalChallenges: await models.Challenge.count(),
      totalChallengesPublished: await models.Challenge.count({ where: { publishedAt: { [Op.ne]: null } } }),
      totalChallengesUnpublished: await models.Challenge.count({ where: { publishedAt: { [Op.eq]: null } } }),
      totalChallengesWhatsapp: await models.Challenge.count({ where: { source: 'whatsapp' } }),
      totalChallengesWeb: await models.Challenge.count({ where: { source: 'web' } }),
      totalChallengesWhatsappPublished : await models.Challenge.count({ where: { source: 'whatsapp', publishedAt: { [Op.ne]: null } } }),
      totalChallengesWebPublished : await models.Challenge.count({ where: { source: 'web', publishedAt: { [Op.ne]: null } } }),
      totalChallengesWhatsappUnpublished : await models.Challenge.count({ where: { source: 'whatsapp', publishedAt: { [Op.eq]: null } } }),
      totalChallengesWebUnpublished : await models.Challenge.count({ where: { source: 'web', publishedAt: { [Op.eq]: null } } }),
      totalInitiatives: await models.Initiative.count(),
      totalInitiativesPublished: await models.Initiative.count({ where: { publishedAt: { [Op.ne]: null } } }),
      totalInitiativesUnpublished: await models.Initiative.count({ where: { publishedAt: { [Op.eq]: null } } }),
      totalInitiativesWhatsapp: await models.Initiative.count({ where: { source: 'whatsapp' } }),
      totalInitiativesWeb: await models.Initiative.count({ where: { source: 'web' } }),
      totalInitiativesWhatsappPublished : await models.Initiative.count({ where: { source: 'whatsapp', publishedAt: { [Op.ne]: null } } }),
      totalInitiativesWebPublished : await models.Initiative.count({ where: { source: 'web', publishedAt: { [Op.ne]: null } } }),
      totalInitiativesWhatsappUnpublished : await models.Initiative.count({ where: { source: 'whatsapp', publishedAt: { [Op.eq]: null } } }),
      totalInitiativesWebUnpublished : await models.Initiative.count({ where: { source: 'web', publishedAt: { [Op.eq]: null } } }),
      totalBotResponses: await models.BotResponse.count(),
      totalBotResponsesSuccess: await models.BotResponse.count({ where: { success: true } }),
      totalBotResponsesError: await models.BotResponse.count({ where: { success: false } }),
      totalBotResponsesUnknown: await models.BotResponse.count({ where: { type: 'unknown' } }),
      totalBotResponsesInitiative: await models.BotResponse.count({ where: { type: 'iniciativa' } }),
      totalBotResponsesInitiativeSuccess: await models.BotResponse.count({ where: { type: 'iniciativa', success: true } }),
      totalBotResponsesInitiativeError: await models.BotResponse.count({ where: { type: 'iniciativa', success: false } }),
      totalBotResponsesChallenge: await models.BotResponse.count({ where: { type: 'desafio' } }),
      totalBotResponsesChallengeSuccess: await models.BotResponse.count({ where: { type: 'desafio', success: true } }),
      totalBotResponsesChallengeError: await models.BotResponse.count({ where: { type: 'desafio', success: false } }),
    }


    return res.status(200).json(stats);

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: msg.error.default })
  }
}

exports.getSimpleStats = async (req, res) => {
  try {
    const stats = {
      totalUsers: await models.User.count(),
      usersVerified: await models.User.count({ where: { emailVerified: true } }),
      totalEntries: await models.BlogEntry.count(),
      totalEntriesPublished: await models.BlogEntry.count({ where: { publishedAt: { [Op.ne]: null } } }),
      totalEntriesUnpublished: 0,
      totalChallenges: await models.Challenge.count(),
      totalChallengesPublished: await models.Challenge.count({ where: { publishedAt: { [Op.ne]: null } } }),
      totalChallengesUnpublished: 0,
      totalInitiatives: await models.Initiative.count(),
      totalInitiativesPublished: await models.Initiative.count({ where: { publishedAt: { [Op.ne]: null } } }),
      totalInitiativesUnpublished: 0,
      totalBotResponses: await models.BotResponse.count(),
      totalBotResponsesSuccess: await models.BotResponse.count({ where: { success: true } }),
    }

    stats.totalEntriesUnpublished = stats.totalEntries - stats.totalEntriesPublished;
    stats.totalChallengesUnpublished = stats.totalChallenges - stats.totalChallenges
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
          model: models.InitiativeContact,
          as: 'contact',
          attributes: ['fullname', 'email', 'phone', 'keepEmailPrivate', 'keepPhonePrivate'],
        },
        {
          model: models.City,
          as: 'city',
          attributes: ['id','name'],
        },
        {
          model: models.Subdivision,
          as: 'subdivision',
          attributes: ['id', 'type', 'name'],
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
        value: (row) => row.contact ? row.contact.fullname : null,
      },
      {
        label: 'contactoEmail',
        value: (row) => row.contact ? row.contact.email : null,
      },
      {
        label: 'contactoEmailPrivado',
        value: (row) => row.contact.keepEmailPrivate ? 'TRUE' : 'FALSE',
      },
      {
        label: 'contactoTelefono',
        value: (row) => row.contact ? row.contact.phone : null,
      },
      {
        label: 'contactoTelefonoPrivado',
        value: (row) => row.contact.keepPhonePrivate ? 'TRUE' : 'FALSE',
      },
      {
        label: 'ciudadId',
        value: 'city.id',
      },
      {
        label: 'ciudadNombre',
        value: 'city.name',
      },
      {
        label: 'subdivisionId',
        value: (row) => row.subdivision ? row.subdivision.id : null
      },
      {
        label: 'subdivisionNombre',
        value: (row) => row.subdivision ? row.subdivision.name : null
      },
      {
        label: 'subdivisionTipo',
        value: (row) => row.subdivision ? row.subdivision.type : null
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
            {
        label: 'customCity',
        value: (row) => row.customCity ? row.customCity : null
      },
      {
        label: 'customSubdivision',
        value: (row) => row.customSubdivision ? row.customSubdivision : null
      },
      {
        label: 'extra',
        value: (row) => row.extra ? JSON.stringify(row.extra) : null
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
          model: models.City,
          as: 'city',
          attributes: ['id','name'],
        },
        {
          model: models.Subdivision,
          as: 'subdivision',
          attributes: ['id', 'type', 'name'],
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
        value: 'city.id',
      },
      {
        label: 'ciudadNombre',
        value: 'city.name',
      },
      {
        label: 'subdivisionId',
        value: (row) => row.subdivision ? row.subdivision.id : null
      },
      {
        label: 'subdivisionNombre',
        value: (row) => row.subdivision ? row.subdivision.name : null
      },
      {
        label: 'subdivisionTipo',
        value: (row) => row.subdivision ? row.subdivision.type : null
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
        value: (row) => row.proposal ? row.proposal : null
      },
      {
        label: 'enPalabras',
        value: 'inWords',
      },
      {
        label: 'customCity',
        value: (row) => row.customCity ? row.customCity : null
      },
      {
        label: 'customSubdivision',
        value: (row) => row.customSubdivision ? row.customSubdivision : null
      },
      {
        label: 'extra',
        value: (row) => row.extra ? JSON.stringify(row.extra) : null
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

exports.listBotResponses = async (req, res) => {
  try {
    // get from query params page and limit (if not provided, default to 1 and 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    // calculateOffset
    const offset = (page - 1) * limit;

    const botResponses = await models.BotResponse.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(botResponses);
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: msg.error.default })
  }
}