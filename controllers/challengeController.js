const models = require("../models");
const msg = require("../utils/messages");
const UtilsHelper = require('../helpers/utilsHelper');
const ChallengeHelper = require('../helpers/challengeHelper');

exports.fetch = async (req, res) => {
 try {
    // get from query params page and limit (if not provided, default to 1 and 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const queryName = req.query.q || null;
    const dimension = req.query.dimension || null;
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
      result = await ChallengeHelper.getChallengeIdsByOneDimension(dimension, queryName);
    } else {
      result = await ChallengeHelper.getIdsWithoutFilteringByDimensions(queryName);
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
          model: models.Subdivision,
          as: 'subdivision',
          attributes: ['id', 'type', 'name', 'latitude', 'longitude'],
          include: [
            {
              model: models.City,
              as: 'city',
              attributes: ['id','name', 'latitude', 'longitude'],
            }
          ]
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
      include: [
        {
          model: models.Dimension,
          as: "dimension",
          attributes: ["id", "name"],
        },
        {
          model: models.Subdivision,
          as: "subdivision",
          attributes: ["id", "name", "type", "latitude", "longitude"],
          include: [
            {
              model: models.City,
              as: "city",
              attributes: ["id", "name", "latitude", "longitude" ],
            },
          ],
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
      subdivisionId,
      needsAndChallenges,
      proposal,
      inWords,
    } = req.body;

    challenge.dimensionId = dimensionId;
    challenge.subdivisionId = subdivisionId;
    challenge.needsAndChallenges = needsAndChallenges;
    challenge.proposal = proposal;
    challenge.inWords = inWords;

    await challenge.save();

    return res.status(200).json(challenge);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}

exports.create = async (req, res) => {
  try {
    const {
      dimensionId,
      subdivisionId,
      needsAndChallenges,
      proposal,
      inWords,
    } = req.body;

    // create a new Challenge entry
    const blogEntry = await models.Challenge.create({
      dimensionId,
      subdivisionId,
      needsAndChallenges,
      proposal,
      inWords,
    });

    return res.status(201).json(blogEntry);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
};

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

    // Fetch all challenges and group counts by city and dimension
    const challenges = await models.Challenge.count({
      group: ["dimensionId", "subdivision.city.id"],
      include: [
        {
          model: models.Subdivision,
          as: "subdivision",
          include: [
            {
              model: models.City,
              as: "city",
            },
          ],
        },
      ],
    });

    // Convert challenges to a map for fast access
    const challengeCounts = challenges.reduce((acc, challenge) => {
      const cityId = challenge.id; // subdivision.city.id;
      const dimensionId = challenge.dimensionId;
      const count = parseInt(challenge.count, 10);

      if (!acc[cityId]) acc[cityId] = {};
      acc[cityId][dimensionId] = count;

      return acc;
    }, {});

    // Populate radar data for each city
    for (const city of cities) {
      const cityData = {
        name: city.name,
        value: dimensions.map(
          (dimension) => challengeCounts[city.id]?.[dimension.id] || 0
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

exports.statsChartCountBySubdivision = async (req, res) => {
  try {
    const cityId = req.params.cityId || null;
    const countBySubdivisions = [];

    // count how many challenges per subdivision per city
    // challenge.subdivision.id , challenge.subdivision.name, challenge.subdivision.city.id, count
    const countOfChallengesPerSubdivision = await models.Challenge.findAll({
      attributes: [
        [models.sequelize.col("subdivision.id"), "subdivisionId"],
        [models.sequelize.col("subdivision.name"), "subdivisionName"],
        [models.sequelize.col("subdivision.city.id"), "cityId"],
        [models.sequelize.col("subdivision.city.name"), "cityName"],
        [models.sequelize.fn("COUNT", "subdivisionId"), "count"],
      ],
      group: ["subdivisionId"],
      include: [
        {
          model: models.Subdivision,
          as: "subdivision",
          where: cityId ? { cityId } : {},
          attributes: [],
          include: [
            {
              model: models.City,
              as: "city",
              where: cityId ? { id: cityId } : {},
              attributes: [],
            },
          ],
        },
      ],
    });

    return res.status(200).json(countOfChallengesPerSubdivision);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
};
