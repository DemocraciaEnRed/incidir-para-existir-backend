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
    // RADAR DATA
    // {
    //   legendData: ['Cali', 'Bogota'] // Names of the cities
    //   radarIndicator: [ // Array with the names of the dimensions
    //    { name: 'Educacion' }
    //    ...
    //   ]
    //   radar: {
    //   data: [
    //     {
    //     value: [], // the count of challenges per dimension
    //     name: 'Cali' // the name of the city
    //     },
    //     ..
    //   ]		 
    //   }
      

    const radarData = {
      legendData: [],
      radarIndicator: [],
      radar: {
        data: []
      }
    };

    const cities = await models.City.findAll({
      attributes: ['id', 'name'],
      include: [
        {
          model: models.Subdivision,
          as: 'subdivisions',
          attributes: ['id', 'name'],
        }
      ]
    });

    radarData.legendData = cities.map(city => city.name);

    const dimensions = await models.Dimension.findAll({
      attributes: ['id', 'name'],
    });

    radarData.radarIndicator = dimensions.map(dimension => ({ name: dimension.name }));
    
    // count how many challenges per dimension per city
    for(let i = 0; i < cities.length; i++) {
      const city = cities[i];
      const data = {
        value: [],
        name: city.name
      };
      for(let j = 0; j < dimensions.length; j++) {
        const dimension = dimensions[j];
        const count = await models.Challenge.count({
          where: {
            dimensionId: dimension.id
          },
          include: [
            {
              model: models.Subdivision,
              as: 'subdivision',
              where: { cityId: city.id }
            }
          ]
        });
        data.value.push(count);
      }
      radarData.radar.data.push(data);
    }

    // Cali's challenes per subdivision
    // Get an array of the subdivisions of Cali and count the challenges per subdivision
    const cali = cities.find(city => city.name === 'Cali');
    const subdivisionsCali = cali.subdivisions;
    const challengesPerSubdivisionOfCali = [];
    for(let i = 0; i < subdivisionsCali.length; i++) {
      const subdivision = subdivisionsCali[i];
      const count = await models.Challenge.count({
        where: {
          subdivisionId: subdivision.id
        }
      });
      challengesPerSubdivisionOfCali.push({
        name: subdivision.name,
        value: count
      });
    }

    // Bogota's challenes per subdivision
    // Get an array of the subdivisions of Bogota and count the challenges per subdivision
    const bogota = cities.find(city => city.name === 'Bogota');
    const subdivisionsBogota = bogota.subdivisions;
    const challengesPerSubdivisionOfBogota = [];
    for(let i = 0; i < subdivisionsBogota.length; i++) {
      const subdivision = subdivisionsBogota[i];
      const count = await models.Challenge.count({
        where: {
          subdivisionId: subdivision.id
        }
      });
      challengesPerSubdivisionOfBogota.push({
        name: subdivision.name,
        value: count
      });
    }

    return res.status(200).json({
      radarData,
      challengesPerSubdivisionOfCali,
      challengesPerSubdivisionOfBogota
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}