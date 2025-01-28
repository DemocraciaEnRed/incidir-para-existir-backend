const models = require('../models');
const dayjs = require('dayjs');
const msg = require('../utils/messages');
const { selectFields } = require('express-validator/lib/field-selection');

exports.fetch = async (req, res) => {
  try {
    // get from query params page and limit (if not provided, default to 1 and 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const categoryId = req.query.category || null;
    const sectionId = req.query.section || null;
    
    // calculateOffset
    const offset = (page - 1) * limit;

    const whereQuery = {};

    if(categoryId) {
      whereQuery.categoryId = categoryId;
    }
    if(sectionId) {
      whereQuery.sectionId = sectionId;
    }

    const query = {
      limit: limit,
      offset: offset,
      where: whereQuery,
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
        {
          model: models.User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'fullName', 'imageUrl', 'role'],
        }
      ],
      order: [['createdAt', 'DESC']],
    }

    const entries = await models.BlogEntry.findAndCountAll(query)

    // return the entries
    return res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}

exports.fetchOneBySlug = async (req, res) => {
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
        {
          model: models.User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'fullName', 'imageUrl', 'role'],
        }
      ]
    });

    if(!entry) {
      return res.status(400).json({ message: msg.error.default });
    }

    return res.status(200).json(entry);
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: msg.error.default });
  }
}

exports.fetchOneById = async (req, res) => {
  try {
    // get query param slug
    const id = req.params.id || null;

    if(!id) {
      return res.status(400).json({ message: msg.error.default });
    }

    // find the entry
    const entry = await models.BlogEntry.findByPk(id, {
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
        {
          model: models.User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'fullName', 'imageUrl', 'role'],
        }
      ]
    });

    if(!entry) {
      return res.status(400).json({ message: msg.error.default });
    }

    return res.status(200).json(entry);
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: msg.error.default });
  }
}


exports.create = async (req, res) => {
  try {
    // get data from body
    const { title, slug, subtitle, text, categoryId, sectionId, authorId } = req.body;
    
    // validate if category exists
    const category = await models.BlogCategory.findByPk(categoryId);
    if(!category) {
      return res.status(400).json({ message: msg.error.default });
    }

    // validate if section exists
    const section = await models.BlogSection.findByPk(sectionId);
    if(!section) {
      return res.status(400).json({ message: msg.error.default });
    }

    // validate if author exists
    const author = await models.User.findByPk(authorId);
    if(!author) {
      return res.status(400).json({ message: msg.error.default });
    }

    // create the entry
    const entry = await models.BlogEntry.create({
      authorId,
      title,
      slug,
      subtitle,
      imageUrl: req.file ? req.file.location : null,
      text,
      categoryId,
      sectionId,
    });

    return res.status(201).json(entry);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}

exports.update = async (req, res) => {
  try {
    // get query param slug
    const id = req.params.id || null;

    if(!id) {
      return res.status(400).json({ message: msg.error.default });
    }

    // find the entry
    const entry = await models.BlogEntry.findByPk(id);

    // validate if category exists
    const category = await models.BlogCategory.findByPk(req.body.categoryId);
    if(!category) {
      return res.status(400).json({ message: msg.error.default });
    }

    // validate if section exists
    const section = await models.BlogSection.findByPk(req.body.sectionId);
    if(!section) { 
      return res.status(400).json({ message: msg.error.default });
    }

    // validate if author exists
    const author = await models.User.findByPk(req.body.authorId);
    if(!author) {
      return res.status(400).json({ message: msg.error.default });
    }

    // update the entry
    entry.title = req.body.title;
    entry.slug = req.body.slug;
    entry.subtitle = req.body.subtitle;
    entry.text = req.body.text;
    if(req.file){
      entry.imageUrl = req.file.location;
    }
    entry.authorId = req.body.authorId;
    entry.categoryId = req.body.categoryId;
    entry.sectionId = req.body.sectionId;
    await entry.save();

    // return the updated entry
    return res.status(200).json(entry);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}

exports.delete = async (req, res) => {
  try {
    // get query param slug
    const id = req.params.id || null;

    if(!id) {
      return res.status(400).json({ message: msg.error.default });
    }

    // find the entry
    const entry = await models.BlogEntry.findByPk(id);

    // delete the entry
    await entry.destroy();

    // return the entry
    return res.status(200).json(entry);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}