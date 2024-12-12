const models = require('../models');
const dayjs = require('dayjs');
const msg = require('../utils/messages');
const { selectFields } = require('express-validator/lib/field-selection');

exports.getAll = async (req, res) => {
  try {
    // get from query params page and limit (if not provided, default to 1 and 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const categoryId = req.query.category || null;
    const sectionId = req.query.section || null;
    
    // calculateOffset
    const offset = (page - 1) * limit;

    const query = {
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: models.BlogCategory,
          as: 'category',
          attributes: ['name'],
        },
        {
          model: models.BlogSection,
          as: 'section',
          attributes: ['name'],
        },
      ],
      where: {},
      order: [['createdAt', 'DESC']],
    }

    if (categoryId) { 
      query.where.categoryId = categoryId;
    }
    
    if (sectionId) {
      query.where.sectionId = sectionId;
    }

    const entries = await models.BlogEntry.findAndCountAll(query)

    // return the entries
    return res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}

exports.getOne = async (req, res) => {
  try {
    // get query param slug
    const slug = req.params.slug || null;

    if(!slug) {
      return res.status(400).json({ message: msg.error.default });
    }

    // find the entry
    const entry = await models.BlogEntry.findOne({
      where: { slug },
      include: [
        {
          model: models.BlogCategory,
          as: 'category',
          attributes: ['id', 'name'],
        },
        {
          model: models.BlogSection,
          as: 'section',
          attributes: ['id', 'name'],
        },
      ]
    });

    return res.status(200).json(entry);
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: msg.error.default });
  }
}