const models = require('../models');
const dayjs = require('dayjs');
const msg = require('../utils/messages');
const UtilsHelper = require('../helpers/utilsHelper');
const InitiativeHelper = require('../helpers/initiativeHelper');
const RecaptchaHelper = require('../helpers/recaptchaHelper');
const { Op } = require('sequelize');
// json2csv
const { Parser } = require('json2csv');

exports.fetch = async (req, res) => {
  try {
    // get from query params page and limit (if not provided, default to 1 and 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const queryName = req.query.q || null;
    let dimension = req.query.dimension || null;
    const city = req.query.city || null;
    const subdivision = req.query.subdivision || null;
    let includeUnpublished = req.query.includeUnpublished || false;
    const isAdmin = UtilsHelper.isAdmin(req.user);

    // calculateOffset
    const offset = (page - 1) * limit;

    if(includeUnpublished && !isAdmin) {
      includeUnpublished = false;
    }

    // dimension can be a single string or an array of strings
    // validate that:
    // - if it's a string, it's a number
    // - if it's an array, all elements are numbers and the max amount is 2
    if(dimension) {
      if(Array.isArray(dimension)) {
        if(dimension.length > 2) {
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

    // if it is an array of 2 dimensions, we'll use the getInitiativeIdsByTwoDimension
    // if it is a single dimension, we'll use the getInitiativeIdsByOneDimension
    // if it is not provided, we'll use the getIdsWithoutFilteringByDimensions

    let result = null;
    // check if we need to filter by dimensions
    if(dimension) {
      // if it's an array of 2 dimensions, we'll use the getInitiativeIdsByTwoDimensions
      if(Array.isArray(dimension) && dimension.length === 2) {
        result = await InitiativeHelper.getIdsByTwoDimensions(dimension[0], dimension[1], queryName, includeUnpublished, city, subdivision);
      }
      else {
        result = await InitiativeHelper.getInitiativeIdsByOneDimension(dimension, queryName, includeUnpublished, city, subdivision);
      }
    } else {
      result = await InitiativeHelper.getIdsWithoutFilteringByDimensions(queryName, includeUnpublished, city, subdivision);
    }

    // get the ids from the result
    const initiativeIds = result.map(row => row.id);

    // get the initiatives
    const initiativesResult = await models.Initiative.findAndCountAll({
      limit: limit,
      offset: offset,
      where: {
        id: initiativeIds,
      },
      order: [['createdAt', 'DESC']],
      distinct: true,
      include: [
        {
          model: models.User,
          as: 'author',
          attributes: ['firstName', 'lastName'],
        },
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
          model: models.InitiativeContact,
          as: 'contact',
          attributes: ['id', 'fullname', 'email', 'phone', 'keepEmailPrivate', 'keepPhonePrivate', 'publicData'],
        },
        {
          model: models.Dimension,
          as: 'dimensions',
          attributes: ['id', 'name'],
          through: { 
            attributes: [],
          },
        },
      ]
    })

    const jsonOutput = JSON.parse(JSON.stringify(initiativesResult))

    // CHANGES TO THE INITIATIVE OBJECT IF YOU'RE NOT AN ADMIN GO HERE
    // ----
    if(!isAdmin) {
      // No need to show the contact object, only the publicData object.
      for(let i = 0; i < jsonOutput.rows.length; i++) {
        jsonOutput.rows[i].contact = { publicData: jsonOutput.rows[i].contact.publicData }
      }
    }

    // return the initiatives
    return res.status(200).json(jsonOutput);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las iniciativas' });
  }
}

exports.fetchOne = async (req, res) => {
  try {
    const initiativeId = req.params.id;
    const isAdmin = UtilsHelper.isAdmin(req.user);

    const initiative = await models.Initiative.findByPk(initiativeId, {
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
          model: models.InitiativeContact,
          as: 'contact',
          attributes: ['fullname', 'email', 'phone', 'keepEmailPrivate', 'keepPhonePrivate', 'publicData'],
        },
        {
          model: models.Dimension,
          as: 'dimensions',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ]
    })

    const jsonOutput = JSON.parse(JSON.stringify(initiative))

    // CHANGES TO THE INITIATIVE OBJECT IF YOU'RE NOT AN ADMIN GO HERE
    // ----
    if(!isAdmin) {
      // No need to show the contact object, only the publicData object.
      jsonOutput.contact = { publicData: jsonOutput.contact.publicData }
    }

    // return the initiative
    return res.status(200).json(jsonOutput);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la iniciativa' });
  }
}

exports.fetchAllGeolocalized = async (req, res) => {
  try {
    const initiatives = await models.Initiative.findAll({
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
          model: models.User,
          as: 'author',
          attributes: ['firstName', 'lastName'],
        },
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
          model: models.InitiativeContact,
          as: 'contact',
          attributes: ['fullname'],
        },
        {
          model: models.Dimension,
          as: 'dimensions',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ]
    })

    return res.status(200).json(initiatives);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las iniciativas' });
  }
}

exports.create = async (req, res) => {
  try {
    const { 
      name, 
      source,
      description, 
      needsAndOffers, 
      dimensionIds,
      subdivisionId,
      latitude,
      longitude,
      recaptchaResponse
    } = req.body;

    // if the user is an admin, we don't need to validate the recaptcha
    if(RecaptchaHelper.requiresRecaptcha(req.user)) {
      // validate the recaptcha
      const recaptchaValidation = await RecaptchaHelper.verifyRecaptcha(recaptchaResponse);
      if(!recaptchaValidation) {
        return res.status(400).json({ message: 'Error en la validación del recaptcha' });
      }
    }

    // get the dimensions
    const dimensions = await models.Dimension.findAll({
      where: {
        id: dimensionIds,
      }
    });

    // check if the subdivisionId exists
    const subdivision = await models.Subdivision.findByPk(subdivisionId);

    if(!subdivision) {
      return res.status(404).json({ message: 'Subdivisión no encontrada' });
    }

    const t = await models.sequelize.transaction();

    try {
      // create the contact
      const contact = {
        fullname: req.body.contact.fullname,
        email: req.body.contact.email,
        keepEmailPrivate: req.body.contact.keepEmailPrivate,
        phone: req.body.contact.phone,
        keepPhonePrivate: req.body.contact.keepPhonePrivate,
      }

      const newContact = await models.InitiativeContact.create(contact, { transaction: t });

      // create the initiative
      const initiative = {
        name,
        source,
        description,
        needsAndOffers,
        contactId: newContact.id,
        subdivisionId: subdivisionId,
        latitude,
        longitude,
        authorId: null,
        publishedAt: new Date(),
      }

      const newInitiative = await models.Initiative.create(initiative, { transaction: t });

      // add the dimensions
      await newInitiative.addDimensions(dimensions, { transaction: t });

      await t.commit();

    } catch(error){
      console.error(error);
      await t.rollback();
      return res.status(500).json({ message: 'Error al crear la iniciativa' });
    }

    return res.status(201).json({ message: 'Iniciativa creada' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la iniciativa' });
  }
}

exports.getById = async (req, res) => {
  try {
    const initiativeId = req.params.id;
    const isAdmin = UtilsHelper.isAdmin(req.user);

    const initiative = await models.Initiative.findByPk(initiativeId, {
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
          model: models.InitiativeContact,
          as: 'contact',
          attributes: ['fullname', 'email', 'phone', 'keepEmailPrivate', 'keepPhonePrivate'],
        },
        {
          model: models.Dimension,
          as: 'dimensions',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ]
    })

    const jsonOutput = JSON.parse(JSON.stringify(initiativesResult))

    // CHANGES TO THE INITIATIVE OBJECT IF YOU'RE NOT AN ADMIN GO HERE
    // ----
    if(!isAdmin) {
      // No need to show the contact object, only the publicData object.
      for(let i = 0; i < jsonOutput.rows.length; i++) {
        jsonOutput.rows[i].contact = { publicData: jsonOutput.rows[i].contact.publicData }
      }
    }

    // return the initiative
    return res.status(200).json(jsonOutput);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la iniciativa' });
  }
}

exports.update = async (req, res) => {
  try {
    const initiativeId = req.params.id;
    
    
    const t = await models.sequelize.transaction();
    
    try {
      const initiative = await models.Initiative.findByPk(initiativeId,{
        include: [
          {
            model: models.Dimension,
            as: 'dimensions',
            attributes: ['id', 'name'],
            through: { attributes: [] },
          }
        ],
        transaction: t,
      });
      
      if(!initiative) {
        throw new Error('Iniciativa no encontrada');
      }
      
      const initiativeContact = await models.InitiativeContact.findByPk(initiative.contactId);
      
      if(!initiativeContact) {
        // return res.status(404).json({ message: 'Contacto de la iniciativa no encontrado' });
        throw new Error('Contacto de la iniciativa no encontrado');
      }

      // update the contact
      const contact = {
        fullname: req.body.contact.fullname,
        email: req.body.contact.email,
        keepEmailPrivate: req.body.contact.keepEmailPrivate,
        phone: req.body.contact.phone,
        keepPhonePrivate: req.body.contact.keepPhonePrivate,
      }
      initiativeContact.fullname = contact.fullname;
      initiativeContact.email = contact.email;
      initiativeContact.keepEmailPrivate = contact.keepEmailPrivate;
      initiativeContact.phone = contact.phone;
      initiativeContact.keepPhonePrivate = contact.keepPhonePrivate;

      await initiativeContact.save({ transaction: t });

      // update the initiative
      initiative.name = req.body.name;
      initiative.source = req.body.source;
      initiative.description = req.body.description;
      initiative.needsAndOffers = req.body.needsAndOffers;
      initiative.subdivisionId = req.body.subdivisionId;
      initiative.latitude = req.body.latitude || null;
      initiative.longitude = req.body.longitude || null;

      await initiative.save({ transaction: t });

      // update the dimensions

      await initiative.removeDimensions(initiative.dimensions.map(d => d.id), { transaction: t });

      const dimensions = await models.Dimension.findAll({
        where: {
          id: req.body.dimensionIds,
        }
      }, {
        transaction: t,
      });

      await initiative.addDimensions(dimensions, { transaction: t });

      await t.commit();

    } catch(error){
      console.error(error);
      await t.rollback();
      return res.status(500).json({ message: 'Error al actualizar la iniciativa' });
    }

    return res.status(200).json({ message: 'Iniciativa actualizada' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la iniciativa' });
  }
}

exports.delete = async (req, res) => {
  const t = await models.sequelize.transaction();

  try {
    const initiativeId = req.params.id;

    const initiative = await models.Initiative.findByPk(initiativeId);

    if(!initiative) {
      return res.status(404).json({ message: 'Iniciativa no encontrada' });
    }

    // delete the initiative dimensions linked
    await models.InitiativeDimension.destroy({
      where: {
        initiativeId: initiativeId,
      },
      transaction: t,
    });

    const contactIdToDelete = initiative.contactId;
    // delete the initiative
    await initiative.destroy({ transaction: t });

    await models.InitiativeContact.destroy({
      where: {
        id: contactIdToDelete,
      },
      transaction: t,
    });

    await t.commit();

    return res.status(200).json({ message: 'Iniciativa eliminada' });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la iniciativa' });
  }
}

exports.publish = async (req, res) => {
  try {
    const initiativeId = req.params.id;

    const initiative = await models.Initiative.findByPk(initiativeId);

    if(!initiative) {
      return res.status(404).json({ message: 'Iniciativa no encontrada' });
    }

    initiative.publishedAt = dayjs().format('YYYY-MM-DD HH:mm:ss');

    await initiative.save();

    return res.status(200).json({ message: 'Iniciativa publicada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al publicar la iniciativa' });
  }
}

exports.unpublish = async (req, res) => {
  try {
    const initiativeId = req.params.id;

    const initiative = await models.Initiative.findByPk(initiativeId);

    if(!initiative) {
      return res.status(404).json({ message: 'Iniciativa no encontrada' });
    }

    initiative.publishedAt = null;

    await initiative.save();

    return res.status(200).json({ message: 'Iniciativa despublicada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al despublicar la iniciativa' });
  }
}


exports.downloadInitiativesCsv = async (req, res) => {
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

    const initiatives = await models.Initiative.findAll({
      where: {
        publishedAt: {
          [Op.not]: null,
        }
      },
      include: [
        {
          model: models.InitiativeContact,
          as: 'contact',
          attributes: ['fullname', 'email', 'phone', 'keepEmailPrivate', 'keepPhonePrivate', 'publicData'],
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
        label: 'fechaPublicacion',
        value:  (row) => dayjs(row.updatedAt).toISOString(),
      },
      {
        label: 'fuente',
        value: 'source',
      },
      {
        label: 'contactoNombreCompleto',
        value: 'contact.publicData.fullname',
      },
      {
        label: 'contactoEmail',
        value: 'contact.publicData.email',
      },
      {
        label: 'contactoTelefono',
        value: 'contact.publicData.phone',
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
    const filename = `${timestamp}_iniciativas_export.csv`;

    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csv);
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: msg.error.default })
  }
}


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

    // Fetch all initiatives and group counts by city and dimension
    const initiativeCounts = await InitiativeHelper.getInitiativesCountByCityAndDimension();
    // this will return something like this:
    // [{
    //   "id" : 1,
    //   "dimensionId" : 1,
    //   "count(i.id)" : 50
    // },
    // {
    //   "id" : 1,
    //   "dimensionId" : 2,
    //   "count(i.id)" : 38
    // },
    // {
    //   "id" : 1,
    //   "dimensionId" : 3,
    //   "count(i.id)" : 42
    // },
    // {
    //   "id" : 1,
    //   "dimensionId" : 4,
    //   "count(i.id)" : 52
    // },
    // {
    //   "id" : 1,
    //   "dimensionId" : 5,
    //   "count(i.id)" : 39
    // },
    // {
    //   "id" : 1,
    //   "dimensionId" : 6,
    //   "count(i.id)" : 43
    // },
    // {
    //   "id" : 1,
    //   "dimensionId" : 7,
    //   "count(i.id)" : 36
    // },
    // {
    //   "id" : 1,
    //   "dimensionId" : 8,
    //   "count(i.id)" : 42
    // },
    // {
    //   "id" : 2,
    //   "dimensionId" : 1,
    //   "count(i.id)" : 18
    // },
    // {
    //   "id" : 2,
    //   "dimensionId" : 2,
    //   "count(i.id)" : 22
    // },
    // {
    //   "id" : 2,
    //   "dimensionId" : 3,
    //   "count(i.id)" : 16
    // },
    // {
    //   "id" : 2,
    //   "dimensionId" : 4,
    //   "count(i.id)" : 19
    // },
    // {
    //   "id" : 2,
    //   "dimensionId" : 5,
    //   "count(i.id)" : 27
    // },
    // {
    //   "id" : 2,
    //   "dimensionId" : 6,
    //   "count(i.id)" : 27
    // },
    // {
    //   "id" : 2,
    //   "dimensionId" : 7,
    //   "count(i.id)" : 22
    // },
    // {
    //   "id" : 2,
    //   "dimensionId" : 8,
    //   "count(i.id)" : 25
    // }]   

    console.log(initiativeCounts)

    // Populate radar data for each city
    for (const city of cities) {
      const cityData = {
        name: city.name,
        label: {
          show: true,
        },
        value: dimensions.map(
          (dimension) => initiativeCounts.find((count) => count.id === city.id && count.dimensionId === dimension.id)?.count || 0
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
    // count how many initiatives are in each city
    const countOfInitiativesPerCity = await models.Initiative.findAll({
      attributes: [
        [models.sequelize.col("subdivision.city.id"), "cityId"],
        [models.sequelize.col("subdivision.city.name"), "cityName"],
        [models.sequelize.fn("COUNT", "cityId"), "count"],
      ],
      where: {
        publishedAt: {
          [Op.not]: null,
        },
      },
      group: ["cityId"],
      distinct: true,
      include: [
        {
          model: models.Subdivision,
          as: "subdivision",
          attributes: [],
          include : [
            {
              model: models.City,
              as: "city",
              attributes: [],
            }
          ]
        },
      ],
    });
    
    const barData = await InitiativeHelper.getInitiativesStatsByDimensionBar();

    const barDataJson = JSON.parse(JSON.stringify(barData));

    // convert percentage to float
    for (let i = 0; i < barDataJson.length; i++) {
      barDataJson[i].percentage = parseFloat(barDataJson[i].percentage);
    }

    return res.status(200).json({
      countOfInitiativesPerCity,
      barDataJson
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
};

exports.statsChartCountBySubdivision = async (req, res) => {
  try {
    const cityId = req.params.cityId || null;
    const countBySubdivisions = [];

    const countOfInitiativesPerSubdivision = await InitiativeHelper.getInitiativesCountBySubdivision(cityId);

    return res.status(200).json(countOfInitiativesPerSubdivision);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
};