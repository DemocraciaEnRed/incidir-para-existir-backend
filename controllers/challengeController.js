const models = require("../models");
const msg = require("../utils/messages");
const UtilsHelper = require('../helpers/utilsHelper');
const ChallengeHelper = require('../helpers/challengeHelper');
const RecaptchaHelper = require('../helpers/recaptchaHelper');
const { Op } = require('sequelize');
const dayjs = require('dayjs');
// json2csv
const { Parser } = require('json2csv');

exports.fetch = async (req, res) => {
 try {
    // get from query params page and limit (if not provided, default to 1 and 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const queryName = req.query.q || null;
    const dimension = req.query.dimension || null;
    const city = req.query.city || null;
    const subdivision = req.query.subdivision || null;
    const isAdmin = UtilsHelper.isAdmin(req.user);
    
    let includeUnpublished = req.query.includeUnpublished || false;

    if(includeUnpublished && !isAdmin) {
      includeUnpublished = false;
    }

    // calculateOffset
    const offset = (page - 1) * limit;

    // dimension can be a single string or an array of strings
    // validate that:
    // - if it's a string, it's a number
    // - if it's an array, all elements are numbers and the max amount is 2
    if(dimension) {
      if(Array.isArray(dimension)) {
        if(dimension.length > 1) {
          return res.status(400).json({ message: 'No se pueden filtrar por más de dos dimensiones' });
        }
        for(let i = 0; i < dimension.length; i++) {
          if(isNaN(parseInt(dimension[i]))) {
            return res.status(400).json({ message: 'Las dimensiones deben ser números' });
          }
        }
      }
      else {
        if(isNaN(parseInt(dimension))) {
          return res.status(400).json({ message: 'Las dimensiones deben ser números' });
        }
      }
    }

    // if it is an array of 2 dimensions, we'll use the getChallengeIdsByTwoDimension
    // if it is a single dimension, we'll use the getChallengeIdsByOneDimension
    // if it is not provided, we'll use the getIdsWithoutFilteringByDimensions

    let result = null;
    // check if we need to filter by dimensions
    if(dimension) {
      // if it's an array of 2 dimensions, we'll use the getChallengeIdsByTwoDimensions
      result = await ChallengeHelper.getChallengeIdsByOneDimension(dimension, queryName, includeUnpublished, city, subdivision);
    } else {
      result = await ChallengeHelper.getIdsWithoutFilteringByDimensions(queryName, includeUnpublished, city, subdivision);
    }

    // get the ids from the result
    const challengeIds = result.map(row => row.id);

    // get the challenges
    const challengesResult = await models.Challenge.findAndCountAll({
      limit: limit,
      offset: offset,
      where: {
        id: challengeIds,
      },
      order: [['createdAt', 'DESC']],
      distinct: true,
      include: [
        {
          model: models.City,
          as: 'city',
          attributes: ['id','name', 'latitude', 'longitude'],
        },
        {
          model: models.Subdivision,
          as: 'subdivision',
          attributes: ['id', 'type', 'name', 'latitude', 'longitude'],
        },
        {
          model: models.Dimension,
          as: 'dimension',
          attributes: ['id', 'name'],
        },
      ]
    })

    // return the entries
    return res.status(200).json(challengesResult);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}

exports.fetchOne = async (req, res) => {
  try {
    const challengeId = req.params.id || null;

    if (!challengeId) {
      return res.status(400).json({ message: msg.error.default });
    }

    const challenge = await models.Challenge.findByPk(challengeId, {
      where: {
        publishedAt: {
          [Op.not]: null,
        },
      },
      include: [
        {
          model: models.City,
          as: "city",
          attributes: ["id", "name", "latitude", "longitude" ],
        },
        {
          model: models.Dimension,
          as: "dimension",
          attributes: ["id", "name"],
        },
        {
          model: models.Subdivision,
          as: "subdivision",
          attributes: ["id", "name", "type", "latitude", "longitude"],
        },
      ],
    });

    if (!challenge) {
      return res.status(404).json({ message: msg.error.notFound });
    }

    return res.status(200).json(challenge);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  } 
};

exports.fetchAllGeolocalized = async (req, res) => {
  try {
    const challenges = await models.Challenge.findAll({
      where: {
        latitude: {
          [Op.not]: null,
        },
        longitude: {
          [Op.not]: null,
        },
        publishedAt: {
          [Op.not]: null,
        }
      },
      include: [
        {
          model: models.City,
          as: 'city',
          attributes: ['id','name', 'latitude', 'longitude'],
        },
        {
          model: models.Subdivision,
          as: 'subdivision',
          attributes: ['id', 'type', 'name', 'latitude', 'longitude']
        },
        {
          model: models.Dimension,
          as: 'dimension',
          attributes: ['id', 'name'],
        },
      ]
    })

    return res.status(200).json(challenges);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los desafios' });
  }
}

exports.create = async (req, res) => {
  try {
    const {
      dimensionId,
      cityId,
      subdivisionId,
      source,
      needsAndChallenges,
      latitude,
      longitude,
      recaptchaResponse,
      proposal,
      inWords,
    } = req.body;


  // validate the recaptcha
    if(RecaptchaHelper.requiresRecaptcha(req.user)) {
      const recaptchaValidation = await RecaptchaHelper.verifyRecaptcha(recaptchaResponse);
      if(!recaptchaValidation) {
        return res.status(400).json({ message: 'Error en la validación del recaptcha' });
      }
    }

    // create a new Challenge entry
    const challenge = await models.Challenge.create({
      dimensionId,
      cityId,
      subdivisionId,
      source,
      needsAndChallenges,
      latitude,
      longitude,
      proposal,
      inWords,
      publishedAt: new Date(),
    });

    return res.status(201).json(challenge);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
};


exports.update = async (req, res) => {
  try {
    const challengeId = req.params.id || null;

    if (!challengeId) {
      return res.status(400).json({ message: msg.error.default });
    }

    const challenge = await models.Challenge.findByPk(challengeId);

    if (!challenge) {
      return res.status(404).json({ message: msg.error.notFound });
    }

    const {
      dimensionId,
      cityId,
      subdivisionId,
      source,
      needsAndChallenges,
      proposal,
      latitude,
      longitude,
      inWords,
    } = req.body;

    console.log(req.body)

    challenge.dimensionId = dimensionId;
    challenge.cityId = cityId;
    if(subdivisionId == undefined){
      challenge.subdivisionId = null;
    } else {
      challenge.subdivisionId = subdivisionId;
    }
    challenge.source = source;
    challenge.needsAndChallenges = needsAndChallenges;
    challenge.proposal = proposal || null;
    challenge.latitude = latitude || null;
    challenge.longitude = longitude || null;
    challenge.inWords = inWords;

    await challenge.save();

    return res.status(200).json(challenge);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}

exports.delete = async (req, res) => {
  try {
    const challengeId = req.params.id || null;

    if (!challengeId) {
      return res.status(400).json({ message: msg.error.default });
    }

    const challenge = await models.Challenge.findByPk(challengeId);

    if (!challenge) {
      return res.status(404).json({ message: msg.error.notFound });
    }

    await challenge.destroy();

    return res.status(204).send();

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
};



exports.statsChartCountByDimension = async (req, res) => {
  try {
    // Initialize radar data structure
    const radarData = {
      legendData: [],
      radarIndicator: [],
      radar: { data: [] },
    };

    // Fetch cities and their subdivisions
    const cities = await models.City.findAll({
      attributes: ["id", "name"],
      include: [
        {
          model: models.Subdivision,
          as: "subdivisions",
          attributes: ["id"],
        },
      ],
    });

    radarData.legendData = cities.map((city) => city.name);

    // Fetch dimensions
    const dimensions = await models.Dimension.findAll({
      attributes: ["id", "name"],
    });

    radarData.radarIndicator = dimensions.map((dimension) => ({
      name: dimension.name,
    }));

    const challengeCounts = await ChallengeHelper.getChallengesCountByCityAndDimension()

    // Populate radar data for each city
    for (const city of cities) {
      const cityData = {
        name: city.name,
        label: {
          show: true,
        },
        value: dimensions.map(
          (dimension) => challengeCounts.find((count) => count.id === city.id && count.dimensionId === dimension.id)?.count || 0
        ),
      };
      radarData.radar.data.push(cityData);
    }

    return res.status(200).json(radarData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
};


exports.statsCountByDimensionBar = async (req, res) => {
  try {
    const cityId = req.params.cityId || null;
    // Initialize radar data structure
    
    const results = await ChallengeHelper.getChallengesStatsByDimensionBar();

    const outputJson = JSON.parse(JSON.stringify(results));

    // convert percentage to float
    for (let i = 0; i < outputJson.length; i++) {
      outputJson[i].percentage = parseFloat(outputJson[i].percentage);
    }

    return res.status(200).json(outputJson);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
};

exports.statsChartCountBySubdivision = async (req, res) => {
  try {
    const cityId = req.params.cityId || null;
    const countBySubdivisions = [];

    // count how many challenges per subdivision per city
    // challenge.subdivision.id , challenge.subdivision.name, challenge.subdivision.city.id, count
    // const countOfChallengesPerSubdivision = await models.Challenge.findAll({
    //   attributes: [
    //     [models.sequelize.col("subdivision.id"), "subdivisionId"],
    //     [models.sequelize.col("subdivision.name"), "subdivisionName"],
    //     [models.sequelize.col("subdivision.type"), "subdivisionType"],
    //     [models.sequelize.col("subdivision.city.id"), "cityId"],
    //     [models.sequelize.col("subdivision.city.name"), "cityName"],
    //     [models.sequelize.fn("COUNT", "subdivisionId"), "count"],
    //   ],
    //   group: ["subdivisionId"],
    //   include: [
    //     {
    //       model: models.Subdivision,
    //       as: "subdivision",
    //       where: cityId ? { cityId } : {},
    //       attributes: [],
    //       include: [
    //         {
    //           model: models.City,
    //           as: "city",
    //           where: cityId ? { id: cityId } : {},
    //           attributes: [],
    //         },
    //       ],
    //     },
    //   ],
    // });

    const countOfChallengesPerSubdivision = await ChallengeHelper.getChallengesCountBySubdivision(cityId);

    return res.status(200).json(countOfChallengesPerSubdivision);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
};

exports.downloadChallengesCsv = async (req, res) => {
  try {

    const recaptchaResponse = req.body.recaptchaResponse;

    // if the user is an admin, we don't need to validate the recaptcha
    if(RecaptchaHelper.requiresRecaptcha(req.user)) {
      // validate the recaptcha
      const recaptchaValidation = await RecaptchaHelper.verifyRecaptcha(recaptchaResponse);
      if(!recaptchaValidation) {
        return res.status(400).json({ message: 'Error en la validación del recaptcha' });
      }
    }

    const challenges = await models.Challenge.findAll({
      where: {
        publishedAt: {
          [Op.not]: null,
        },
      },
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
    const filename = `${timestamp}_desafios_export.csv`;

    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csv);
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: msg.error.default })
  }
}

exports.publish = async (req, res) => {
  try {
    const challengeId = req.params.id;

    const challenge = await models.Challenge.findByPk(challengeId);

    if(!challenge) {
      return res.status(404).json({ message: 'Desafio no encontrado' });
    }

    challenge.publishedAt = dayjs().format('YYYY-MM-DD HH:mm:ss');

    await challenge.save();

    return res.status(200).json({ message: 'Desafio publicado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al publicar el desafío' });
  }
}

exports.unpublish = async (req, res) => {
  try {
    const challengeId = req.params.id;

    const challenge = await models.Challenge.findByPk(challengeId);

    if(!challenge) {
      return res.status(404).json({ message: 'Desafío no encontrado' });
    }

    challenge.publishedAt = null;

    await challenge.save();

    return res.status(200).json({ message: 'Desafío despublicado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al despublicar el desafío' });
  }
}