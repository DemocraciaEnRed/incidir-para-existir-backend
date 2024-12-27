const models = require("../models");
const msg = require("../utils/messages");

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
