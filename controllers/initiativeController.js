const models = require('../models');
const dayjs = require('dayjs');
const msg = require('../utils/messages');
const UtilsHelper = require('../helpers/utilsHelper');
const InitiativeHelper = require('../helpers/initiativeHelper');
const { Op } = require('sequelize');

exports.fetch = async (req, res) => {
  try {
    // get from query params page and limit (if not provided, default to 1 and 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const queryName = req.query.q || null;
    let dimension = req.query.dimension || null;
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
        result = await InitiativeHelper.getIdsByTwoDimensions(dimension[0], dimension[1], queryName, includeUnpublished);
      }
      else {
        result = await InitiativeHelper.getInitiativeIdsByOneDimension(dimension, queryName, includeUnpublished);
      }
    } else {
      result = await InitiativeHelper.getIdsWithoutFilteringByDimensions(queryName, includeUnpublished);
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
          attributes: ['id', 'name'],
          include: [
            {
              model: models.City,
              as: 'city',
              attributes: ['id','name'],
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

    const initiative = await models.Initiative.findByPk(initiativeId, {
      include: [
        {
          model: models.User,
          as: 'author',
          attributes: ['firstName', 'lastName'],
        },
        {
          model: models.Subdivision,
          as: 'subdivision',
          attributes: ['name'],
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

    // return the initiative
    return res.status(200).json(initiative);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la iniciativa' });
  }
}

exports.create = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      needsAndOffers, 
      dimensionIds,
      subdivisionId
    } = req.body;

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
        description,
        needsAndOffers,
        contactId: newContact.id,
        subdivisionId: subdivisionId,
        authorId: null,
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

    const initiative = await models.Initiative.findByPk(initiativeId, {
      include: [
        {
          model: models.User,
          as: 'author',
          attributes: ['firstName', 'lastName'],
        },
        {
          model: models.Subdivision,
          as: 'subdivision',
          attributes: ['name'],
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

    // return the initiative
    return res.status(200).json(initiative);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la iniciativa' });
  }
}

exports.update = async (req, res) => {
  try {
    const initiativeId = req.params.id;

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