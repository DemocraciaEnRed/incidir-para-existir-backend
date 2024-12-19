const models = require('../models');
const dayjs = require('dayjs');
const msg = require('../utils/messages');

exports.getAll = async (req, res) => {
  try {
    // get from query params page and limit (if not provided, default to 1 and 10)
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    
    // calculateOffset
    const offset = (page - 1) * limit;

    const initiatives = await models.Initiative.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']],
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

    // return the initiatives
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
      description, 
      needsAndOffers, 
      dimensionIds,
      subdivisionId
    } = req.body;
    const userId = req.user.id;

    // get the user
    const user = await models.User.findOne({
      where: { id: userId },
      include: [
        {
          model: models.Subdivision,
          as: 'subdivision',
        }
      ]
    });

    if(!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // get the dimensions
    const dimensions = await models.Dimension.findAll({
      where: {
        id: dimensionIds,
      }
    });

    // TODO: check if the subdivisionId exists and the city of the subdivision is the same as the user's city

    const t = await models.sequelize.transaction();
    try {
      // create the contact
      const contact = {
        fullname: req.body.contact.fullname,
        email: req.body.contact.email,
        phone: req.body.contact.phone,
        keepPrivate: req.body.contact.keepPrivate,
      }

      const newContact = await models.InitiativeContact.create(contact, { transaction: t });

      // create the initiative
      const initiative = {
        name,
        description,
        needsAndOffers,
        contactId: newContact.id,
        subdivisionId: subdivisionId,
        authorId: user.id,
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
  try {
    const initiativeId = req.params.id;

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la iniciativa' });
  }
}