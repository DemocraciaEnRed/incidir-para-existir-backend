const { faker } = require('@faker-js/faker');
const models = require('../models');
const dayjs = require('dayjs');
const msg = require('../utils/messages');
const UtilsHelper = require('../helpers/utilsHelper');

exports.getConfigs = async (req, res) => {
  try {
    const keys = req.query.keys ? req.query.keys.split(',') : null;
    
    const configs = await UtilsHelper.getConfigs(keys);

    return res.status(200).json(configs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: msg.error.default });
  }
}

exports.setConfigs = async (req, res) => {
  try {
    const { key, type, value } = req.body;

    const config = await models.Config.findOne({
      where: { key: key }
    });

    if (!config) {
      return res.status(404).json({ message: msg.error.notFound });
    }

    config.type = type || config.type;
    config.value = value.toString();
    await config.save();

    return res.status(200).json(config);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: msg.error.default });
  }
}

exports.getSubdivisions = async (req, res) => {
  try {
    // get all subdivisions
    const subdivisions = await models.Subdivision.findAll({
      attributes: ['id', 'name', 'type'],
      include: [
        {
          model: models.City,
          as: 'city',
          attributes: ['id', 'name'],
        }
      ]
    });

    return res.status(200).json(subdivisions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: msg.error.default });
  }
}

exports.getCities = async (req, res) => {
  try {
    // get all cities
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

    return res.status(200).json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: msg.error.default });
  }
}

exports.getDimensions = async (req, res) => {
  try {
    // get all dimensions
    const dimensions = await models.Dimension.findAll({
      attributes: ['id', 'name'],
    });

    return res.status(200).json(dimensions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: msg.error.default });
  }
}
