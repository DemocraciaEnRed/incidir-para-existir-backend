const models = require('../models');
const msg = require('../utils/messages');

exports.create = async (req, res) => {
  try {
    const { 
      dimensionId,
      subdivisionId,
      needsAndChallenges,
      proposal,
      inWords
     } = req.body;

     // create a new Challenge entry
    const blogEntry = await models.Challenge.create({
      dimensionId,
      subdivisionId,
      needsAndChallenges,
      proposal,
      inWords
    });
    
     return res.status(201).json(blogEntry);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}

exports.stats = async (req, res) => {
  try {
    const cityId = parseInt(req.query.cityId) || null;
    // count how many challenges per dimension
    const countChallengesPerDimension = await models.Challenge.count({
      attributes: ['dimensionId'],
      include: [
        {
          model: models.Subdivision,
          as: 'subdivision',
          where: cityId ? { cityId: cityId } : {}
        }
      ],
      group: ['dimensionId']
    });

    // count how many challenges per city
    const countChallengesInCity = await models.Challenge.count({
      attributes: ['subdivision.cityId'],
      include: [
        {
          model: models.Subdivision,
          as: 'subdivision',
          where: cityId ? { cityId: cityId } : {}
        }
      ],
      group: ['subdivision.cityId'],
    });

    // {
    //   "countChallengesPerDimension": [
    //     {
    //       "dimensionId": 1,
    //       "count": 2
    //     },
    //     {
    //       "dimensionId": 4,
    //       "count": 2
    //     },
    //     {
    //       "dimensionId": 2,
    //       "count": 1
    //     },
    //     {
    //       "dimensionId": 3,
    //       "count": 1
    //     },
    //     {
    //       "dimensionId": 6,
    //       "count": 1
    //     },
    //     {
    //       "dimensionId": 5,
    //       "count": 1
    //     },
    //     {
    //       "dimensionId": 7,
    //       "count": 1
    //     }
    //   ],
    //   "countChallengesInCity": [
    //     {
    //       "cityId": 1,
    //       "count": 5
    //     },
    //     {
    //       "cityId": 2,
    //       "count": 4
    //     }
    //   ]
    // }

    return res.status(200).json({
      countChallengesPerDimension,
      countChallengesInCity
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}