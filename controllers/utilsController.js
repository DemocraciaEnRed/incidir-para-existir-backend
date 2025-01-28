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

exports.getBlogCategories = async (req, res) => {
  try {
    // get all blogCategory
    const blogCategory = await models.BlogCategory.findAll({
      attributes: ['id', 'name'],
    });

    return res.status(200).json(blogCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: msg.error.default });
  }
}

exports.getBlogSections = async (req, res) => {
  try {
    // get all blogSections
    const blogSections = await models.BlogSection.findAll({
      attributes: ['id', 'name'],
    });

    return res.status(200).json(blogSections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: msg.error.default });
  }
}
