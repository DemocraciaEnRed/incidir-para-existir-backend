
const models = require('../models');
const msg = require('../utils/messages');


async function saveInitiative(payload) {
  // PAYLOAD EXAMPLE
  // REQUEST BODY:
  // {
  //   "axis": "k",
  //   "city": "a", // a) cali  b) bogota
  //   "type": "iniciativa",
  //   "offer": "Paguenmen dienro",
  //   "title": "Ayudenmee porfavor",
  //   "author": {
  //     "name": "mariano",
  //     "email": "mari@ano.com",
  //     "phone": "129387129837"
  //   },
  //   "resume": "NEcesito 5 sueldos ricos y portentosos",
  //   "comuna_cali": "2", // number from '1' to '22' for cali, '0' is null
  //   "locality_cali": "a", // a) comuna  b) corregimniento
  //   "locality_bogota": "", // a to s, and t is null.
  //   "corregimiento_cali": "" // a to o
  // }
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
      cityId: null,
      subdivisionId: null,
      latitude: null,
      longitude: null,
      authorId: null,
      publishedAt: new Date(),
      customCity: payload.city,
      customSubdivision: payload.locality,
      extra: JSON.stringify(payload)
    }

    // Enum of cities:
    const validCities = {
      a: 'Cali',
      b: 'Bogotá',
    };

    // Enum of cali types
    const validCaliType = {
      a: 'Comuna',
      b: 'Corregimiento',
      c: null
    }

    // Enum of cali comunas
    const validComunas = {
      '0': null,
      '1': 'Nro. 1',
      '2': 'Nro. 2',
      '3': 'Nro. 3',
      '4': 'Nro. 4',
      '5': 'Nro. 5',
      '6': 'Nro. 6',
      '7': 'Nro. 7',
      '8': 'Nro. 8',
      '9': 'Nro. 9',
      '10': 'Nro. 10',
      '11': 'Nro. 11',
      '12': 'Nro. 12',
      '13': 'Nro. 13',
      '14': 'Nro. 14',
      '15': 'Nro. 15',
      '16': 'Nro. 16',
      '17': 'Nro. 17',
      '18': 'Nro. 18',
      '19': 'Nro. 19',
      '20': 'Nro. 20',
      '21': 'Nro. 21',
      '22': 'Nro. 22',
    }

    // Enum of cali corregimientos
    const validCorregimientos = {
      a: 'El Hormiguero',
      b: 'El Saladito',
      c: 'Felidia',
      d: 'Golondrinas',
      e: 'La Buitrera',
      f: 'La Castilla',
      g: 'La Elvira',
      h: 'La Leonera',
      i: 'La Paz',
      j: 'Los Andes',
      k: 'Montebello',
      l: 'Navarro',
      m: 'Pance',
      n: 'Pichindé',
      o: 'Villacarmelo',
    }

    // Enum of bogota localities
    const validLocalitiesBogota = {
      a: 'Usaquén',
      b: 'Chapinero',
      c: 'Santa Fe',
      d: 'San Cristóbal',
      e: 'Usme',
      f: 'Tunjuelito',
      g: 'Bosa',
      h: 'Kennedy',
      i: 'Fontibón',
      j: 'Engativá',
      k: 'Suba',
      l: 'Barrios Unidos',
      m: 'Teusaquillo',
      n: 'Los Mártires',
      o: 'Antonio Nariño',
      p: 'Puente Aranda',
      q: 'Candelaria',
      r: 'Rafael Uribe',
      s: 'Ciudad Bolívar',
      t: null
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

    // let finalSubdivisionName = null;
    let subdivision = null;
    if(selectedCity === 'a') {
      // if city is Cali
      const selectedCaliType = payload.locality_cali.toLowerCase();
      if(validCaliType[selectedCaliType] == null) {
        // if null, set subdivision to null
        // finalSubdivisionName = null;
      } else if (validCaliType[selectedCaliType] == undefined) {
        // undefined is not a valid option in the bot so it should be an error
        throw new Error('Invalid locality_cali: ' + selectedCaliType);
      } else if(selectedCaliType === 'a') {
        // if locality_cali is 'a', its comuna...
        const comuna = validComunas[payload.comuna_cali]; // should be a number but in a string format
        if (comuna) {
          // validate subdivision
          subdivision = await models.Subdivision.findOne({
            where: {
              name: comuna
            }
          }, {
            transaction: t
          });
          if (!subdivision) {
            throw new Error('Invalid subdivision: ' + comuna);
          }
        } else {
          // finalSubdivisionName = null
        }
      } else if (selectedCaliType === 'b') {
        // if locality_cali is 'b', its corregimiento...
        const corregimiento = validCorregimientos[payload.corregimiento_cali.toLowerCase()];
        if (!corregimiento) {
          throw new Error('Invalid corregimiento: ' + payload.corregimiento_cali);
        } else {
          subdivision = await models.Subdivision.findOne({
            where: {
              name: corregimiento
            }
          }, {
            transaction: t
          });
          if (!subdivision) {
            throw new Error('Invalid subdivision: ' + corregimiento);
          }
        }
      }
    } else if (selectedCity === 'b') {
      // if city is Bogotá
      const localityBogota = validLocalitiesBogota[payload.locality_bogota.toLowerCase()];
      if (!localityBogota) {
        // if null, set subdivision to null
        // finalSubdivisionName = null;
      } else {
        // validate subdivision
        subdivision = await models.Subdivision.findOne({
          where: {
            name: localityBogota
          },
          transaction: t
        });
        if (!subdivision) {
          throw new Error('Invalid subdivision: ' + localityBogota);
        }
      }
    }

    initiative.cityId = city.id;
    initiative.customCity = `Opcion elegida: ${payload.city} | ${city ? city.name : '- Error? -'}`;
    if (subdivision) {
      initiative.subdivisionId = subdivision.id;
      initiative.customSubdivision = `Opcion comuna_cali: "${payload.comuna_cali}" | Opcion locality_cali: "${payload.locality_cali}" | Opcion locality_bogota: "${payload.locality_bogota}" | Opcion corregimiento_cali: "${payload.corregimiento_cali}" | Subdivision encontrada: "${subdivision ? subdivision.name : '- Error? -'}"`;
    } else {
      initiative.customSubdivision = `Opcion comuna_cali: "${payload.comuna_cali}" | Opcion locality_cali: "${payload.locality_cali}" | Opcion locality_bogota: "${payload.locality_bogota}" | Opcion corregimiento_cali: "${payload.corregimiento_cali}" | Subdivision indiferente - No aplica, o aplica a todas las subdivisiones"`;
    }

    // now deal with the axis (dimension)
   
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
  // REQUEST BODY:
  // {
  //   "axis": "A",
  //   "city": "A",
  //   "type": "desafio",
  //   "offer": "No",
  //   "resume": "Doce 🍬",
  //   "keywords": "Dos caramelos",
  //   "comuna_cali": "",
  //   "locality_cali": "C",
  //   "locality_bogota": "",
  //   "corregimiento_cali": ""
  // }
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
      cityId: null,
      subdivisionId: null,
      dimensionId: null,
      publishedAt: new Date(),
      customCity: payload.city,
      customSubdivision: payload.locality,
      extra: JSON.stringify(payload)
    }

    // Enum of cities:
    const validCities = {
      a: 'Cali',
      b: 'Bogotá',
    };

    // Enum of cali types
    const validCaliType = {
      a: 'Comuna',
      b: 'Corregimiento',
      c: null
    }

    // Enum of cali comunas
    const validComunas = {
      '0': null,
      '1': 'Nro. 1',
      '2': 'Nro. 2',
      '3': 'Nro. 3',
      '4': 'Nro. 4',
      '5': 'Nro. 5',
      '6': 'Nro. 6',
      '7': 'Nro. 7',
      '8': 'Nro. 8',
      '9': 'Nro. 9',
      '10': 'Nro. 10',
      '11': 'Nro. 11',
      '12': 'Nro. 12',
      '13': 'Nro. 13',
      '14': 'Nro. 14',
      '15': 'Nro. 15',
      '16': 'Nro. 16',
      '17': 'Nro. 17',
      '18': 'Nro. 18',
      '19': 'Nro. 19',
      '20': 'Nro. 20',
      '21': 'Nro. 21',
      '22': 'Nro. 22',
    }

    // Enum of cali corregimientos
    const validCorregimientos = {
      a: 'El Hormiguero',
      b: 'El Saladito',
      c: 'Felidia',
      d: 'Golondrinas',
      e: 'La Buitrera',
      f: 'La Castilla',
      g: 'La Elvira',
      h: 'La Leonera',
      i: 'La Paz',
      j: 'Los Andes',
      k: 'Montebello',
      l: 'Navarro',
      m: 'Pance',
      n: 'Pichindé',
      o: 'Villacarmelo',
    }

    // Enum of bogota localities
    const validLocalitiesBogota = {
      a: 'Usaquén',
      b: 'Chapinero',
      c: 'Santa Fe',
      d: 'San Cristóbal',
      e: 'Usme',
      f: 'Tunjuelito',
      g: 'Bosa',
      h: 'Kennedy',
      i: 'Fontibón',
      j: 'Engativá',
      k: 'Suba',
      l: 'Barrios Unidos',
      m: 'Teusaquillo',
      n: 'Los Mártires',
      o: 'Antonio Nariño',
      p: 'Puente Aranda',
      q: 'Candelaria',
      r: 'Rafael Uribe',
      s: 'Ciudad Bolívar',
      t: null
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

    // let finalSubdivisionName = null;
    let subdivision = null;
    if(selectedCity === 'a') {
      // if city is Cali
      const selectedCaliType = payload.locality_cali.toLowerCase();
      if(validCaliType[selectedCaliType] == null) {
        // if null, set subdivision to null
        // finalSubdivisionName = null;
      } else if (validCaliType[selectedCaliType] == undefined) {
        // undefined is not a valid option in the bot so it should be an error
        throw new Error('Invalid locality_cali: ' + selectedCaliType);
      } else if(selectedCaliType === 'a') {
        // if locality_cali is 'a', its comuna...
        const comuna = validComunas[payload.comuna_cali]; // should be a number but in a string format
        if (comuna) {
          // validate subdivision
          subdivision = await models.Subdivision.findOne({
            where: {
              name: comuna
            }
          }, {
            transaction: t
          });
          if (!subdivision) {
            throw new Error('Invalid subdivision: ' + comuna);
          }
        } else {
          // finalSubdivisionName = null
        }
      } else if (selectedCaliType === 'b') {
        // if locality_cali is 'b', its corregimiento...
        const corregimiento = validCorregimientos[payload.corregimiento_cali.toLowerCase()];
        if (!corregimiento) {
          throw new Error('Invalid corregimiento: ' + payload.corregimiento_cali);
        } else {
          subdivision = await models.Subdivision.findOne({
            where: {
              name: corregimiento
            }
          }, {
            transaction: t
          });
          if (!subdivision) {
            throw new Error('Invalid subdivision: ' + corregimiento);
          }
        }
      }
    } else if (selectedCity === 'b') {
      // if city is Bogotá
      const localityBogota = validLocalitiesBogota[payload.locality_bogota.toLowerCase()];
      if (!localityBogota) {
        // if null, set subdivision to null
        // finalSubdivisionName = null;
      } else {
        // validate subdivision
        subdivision = await models.Subdivision.findOne({
          where: {
            name: localityBogota
          },
          transaction: t
        });
        if (!subdivision) {
          throw new Error('Invalid subdivision: ' + localityBogota);
        }
      }
    }

    challenge.cityId = city.id;
    challenge.customCity = `Opcion elegida: ${payload.city} | ${city ? city.name : '- Error? -'}`;
    if (subdivision) {
      challenge.subdivisionId = subdivision.id;
      challenge.customSubdivision = `Opcion comuna_cali: "${payload.comuna_cali}" | Opcion locality_cali: "${payload.locality_cali}" | Opcion locality_bogota: "${payload.locality_bogota}" | Opcion corregimiento_cali: "${payload.corregimiento_cali}" | Subdivision encontrada: "${subdivision ? subdivision.name : '- Error? -'}"`;
    } else {
      challenge.customSubdivision = `Opcion comuna_cali: "${payload.comuna_cali}" | Opcion locality_cali: "${payload.locality_cali}" | Opcion locality_bogota: "${payload.locality_bogota}" | Opcion corregimiento_cali: "${payload.corregimiento_cali}" | Subdivision indiferente - No aplica, o aplica a todas las subdivisiones"`;
    }

    // now deal with the axis (dimension)

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


    const botResponseInstance = await models.BotResponse.create({
      payload: req.body
    });
    
    console.log('Payload saved successfully to BotResponse model');
    console.log('==================================')

    // LOGIC FOR INITIATIVE OR CHALLENGES
    const payload = req.body;

    try {
      if(payload.type === 'iniciativa') {
        console.log('Saving initiative')
        botResponseInstance.type = 'iniciativa';
        await botResponseInstance.save();
        await saveInitiative(payload);
        botResponseInstance.success = true;
        await botResponseInstance.save();
      } else if (payload.type === 'desafio') {
        botResponseInstance.type = 'desafio';
        await botResponseInstance.save();
        console.log('Processing challenge');
        await saveChallenge(payload);
        botResponseInstance.success = true;
        await botResponseInstance.save();
      } else {
        console.log('NOTE: Unknown type');
        console.log('- Not saving a new initiative or challenge');
        console.log('- Please check the payload type');
        console.log('==================================')
        // Do not make the webhook fail.
        // Just log the error and save the payload
        botResponseInstance.type = 'unknown';
        botResponseInstance.success = false;
        botResponseInstance.errorTrace = JSON.stringify({'type': 'Unknown type'});
        await botResponseInstance.save();
      }
    } catch (error) {
      console.error('Error saving initiative or challenge');
      console.error(error);
      console.log('Please check the error. Payload will still be saved')
      console.log('==================================')
      botResponseInstance.success = false;
      botResponseInstance.errorTrace = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
      await botResponseInstance.save();
    }

    console.log('Returning 200 OK');
    // Return 200 OK
    return res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: msg.error.default });
  }
}
