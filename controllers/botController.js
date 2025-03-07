
const models = require('../models');
const msg = require('../utils/messages');


async function saveInitiative(payload) {
  // PAYLOAD EXAMPLE
  // REQUEST BODY: {
  //   type: 'iniciativa',
  //   author: {
  //     name: 'Mariano Prueba',
  //     email: 'mariano@prueba.com',
  //     phone: '3873873873'
  //   },
  //   city: 'a',
  //   locality: 'CacaLili',
  //   title: 'Prueba iniciativa',
  //   resume: 'Algo prueba hola iniciativa',
  //   axis: 'b',
  //   offer: 'NOOO'
  // }
  console.log('Saving initiative')
  const t = await models.sequelize.transaction();

  try {

    const contact = {
      fullname: payload.author.name,
      email: payload.author.email,
      keepEmailPrivate: true,
      phone: payload.author.phone,
      keepPhonePrivate: true,
    }

    const newContact = await models.InitiativeContact.create(contact, { transaction: t });
    
    const initiative = {
      name: payload.title,
      source: 'whatsapp',
      description: payload.resume,
      needsAndOffers: payload.offer,
      contactId: newContact.id,
      subdivisionId: null,
      latitude: null,
      longitude: null,
      authorId: null,
      publishedAt: null,
      customCity: payload.city,
      customSubdivision: payload.locality,
      extra: JSON.stringify({
        axis: payload.axis,
      })
    }


    // Enum of cities:
    // a: 'Cali',
    // b: 'Bogotá',
    const validCities = {
      a: 'Cali',
      b: 'Bogotá',
    };

    // convert the option to lowercase
    const selectedCity = payload.city.toLowerCase();

    const city = await models.City.findOne({
      where: {
        name: validCities[selectedCity]
      }
    }, {
      transaction: t
    });

    if (!city) {
      throw new Error('Invalid city: ' + selectedCity);
    }

    // enum of axis
    const validAxis = {
      a: 'Educación de calidad',
      b: 'Empleo digno',
      c: 'Espacios públicos seguros',
      d: 'Salud Integral',
      e: 'Participación política juvenil',
      f: 'Transporte público digno',
      g: 'Ambiente sano',
      h: 'Ocio y cultura',
    }

    // convert the option to lowercase
    const selectedAxis = payload.axis.toLowerCase();

    let dimension = await models.Dimension.findOne({
      where: {
        name: validAxis[selectedAxis]
      }
    }, {
      transaction: t
    });

    if (!dimension) {
      console.log('Invalid dimension: ' + selectedAxis);
      
      // selecting the first dimension as default
      const allDimensions = await models.Dimension.findAll();
      dimension = allDimensions[0];
    }

    initiative.customCity = `${payload.city} - ${city.name}`;

    const newInitiative = await models.Initiative.create(initiative, { transaction: t });

    await newInitiative.addDimension(dimension, { transaction: t });

    await t.commit();
    
    console.log('Initiative saved successfully');

  } catch (error) {
    console.error('Error saving initiative... rolling back transaction');
    await t.rollback();
    throw error;
  }
}

async function saveChallenge(payload) {
  // PAYLOAD EXAMPLE
  // REQUEST BODY: {"axis": "c", "city": "b", "type": "desafio", "offer": "Mas actividades grupales!", "resume": "Como hacer de Cali una ciudad que usemos mas el espacio publico", "keywords": "vida urbana", "locality": "zona t"}
  console.log('Saving challenge');
  const t = await models.sequelize.transaction();
  
  try {
    const challenge = {
      needsAndChallenges: payload.resume,
      proposal: payload.offer,
      inWords: payload.keywords,
      source: 'whatsapp',
      latitude: null,
      longitude: null,
      subdivisionId: null,
      dimensionId: null,
      customCity: payload.city,
      customSubdivision: payload.locality,
    }

    const validCities = {
      a: 'Cali',
      b: 'Bogotá',
    };

    const selectedCity = payload.city.toLowerCase();

    const city = await models.City.findOne({
      where: {
        name: validCities[selectedCity]
      }
    }, {
      transaction: t
    });

    if (!city) {
      throw new Error('Invalid city: ' + selectedCity);
    }

    const validAxis = {
      a: 'Educación de calidad',
      b: 'Empleo digno',
      c: 'Espacios públicos seguros',
      d: 'Salud Integral',
      e: 'Participación política juvenil',
      f: 'Transporte público digno',
      g: 'Ambiente sano',
      h: 'Ocio y cultura',
    }

    const selectedAxis = payload.axis.toLowerCase();

    let dimension = await models.Dimension.findOne({
      where: {
        name: validAxis[selectedAxis]
      }
    }, {
      transaction: t
    });

    if (!dimension) {
      console.log('Invalid dimension: ' + selectedAxis);
      
      const allDimensions = await models.Dimension.findAll();
      dimension = allDimensions[0];
    }

    challenge.customCity = `${payload.city} - ${city.name}`;
    
    challenge.dimensionId = dimension.id;

    await models.Challenge.create(challenge, { transaction: t });

    await t.commit();
    
    console.log('Challenge saved successfully');
  } catch (error) {
    console.error('Error saving challenge... rolling back transaction');
    await t.rollback();
    throw error;
  }
}
exports.postTwilioWebhook = async (req, res) => {
  try {
    console.log('==================================')
    console.log('POST /whatsapp')
    console.log('==================================')
    console.log('REQUEST BODY:', req.body)
    console.log('==================================')
    console.log('REQUEST HEADERS:', req.headers)
    console.log('==================================')
    console.log('REQUEST QUERY:', req.query)
    console.log('==================================')
    
    // Stringify the request body in case it's an object
    console.log('REQUEST BODY STRINGIFIED:')
    console.log(JSON.stringify(req.body))
    console.log('==================================')
    console.log('REQUEST BODY LENGTH:', JSON.stringify(req.body).length);
    console.log('==================================')
    console.log('REQUEST HEADERS STRINGIFIED:')
    console.log(JSON.stringify(req.headers))
    console.log('==================================')

    console.log('Saving payload to BotResponse model')


    await models.BotResponse.create({
      payload: req.body
    });
    
    console.log('Payload saved successfully to BotResponse model');
    console.log('==================================')

    // LOGIC FOR INITIATIVE OR CHALLENGES
    const payload = req.body;

    try {
      if(payload.type === 'iniciativa') {
        console.log('Saving initiative')
        await saveInitiative(payload);
      } else if (payload.type === 'desafio') {
        console.log('Processing challenge');
        await saveChallenge(payload);
      } else {
        console.log('NOTE: Unknown type');
        console.log('- Not saving a new initiative or challenge');
        console.log('- Please check the payload type');
        console.log('==================================')
        // Do not make the webhook fail.
      }
    } catch (error) {
      console.error('Error saving initiative or challenge');
      console.error(error);
      console.log('Please check the error. Payload will still be saved')
      console.log('==================================')
    }

    // Return 200 OK
    return res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: msg.error.default });
  }
}
