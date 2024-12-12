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