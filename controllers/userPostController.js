const models = require('../models');
const dayjs = require('dayjs');
const msg = require('../utils/messages');
const BlogHelper = require('../helpers/blogHelper');
const { selectFields } = require('express-validator/lib/field-selection');
const { Op } = require('sequelize');

exports.fetch = async (req, res) => {
  try {
    // get from query params page and limit (if not provided, default to 1 and 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const categoryId = req.query.category || null;
    
    // calculateOffset
    const offset = (page - 1) * limit;

    const whereQuery = {
      authorId: req.user.id,
    };

    if(categoryId) {
      whereQuery.categoryId = categoryId;
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

exports.create = async (req, res) => {
  try {
    // get data from body
    const { title, slug, subtitle, text, categoryId } = req.body;
    const user = req.user;
    // validate if category exists
    const category = await models.BlogCategory.findByPk(categoryId);

    if(!category) {
      return res.status(400).json({ message: msg.error.default });
    }

    // validate if section exists
    const section = await models.BlogSection.findOne({
      where: { name: 'Juventudes' }
    })

    if(!section) {
      return res.status(400).json({ message: msg.error.default });
    }

    // create the entry
    const entry = await models.BlogEntry.create({
      authorId: req.user.id,
      title,
      slug,
      subtitle,
      imageUrl: req.file ? req.file.location : null,
      text,
      categoryId: category.id,
      sectionId: section.id,
      publishedAt: null
    });

    try {
      const retrievedUser = await models.User.findByPk(user.id);
      await BlogHelper.sendNotificationOfPendingPostToAdmins(retrievedUser.fullName, retrievedUser.email, title, subtitle, category.name)
    } catch (error) {
      console.error('Error sending notification to admins notifying of pending post - Skipping email sending');
      console.error(error);
    }

    return res.status(201).json(entry);
  } catch (error) {
    console.error(error);
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
    const entry = await models.BlogEntry.findOne({
      where: {
        id: id,
        authorId: req.user.id
      },
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

exports.update = async (req, res) => {
  try {
    // get query param slug
    const id = req.params.id || null;

    if(!id) {
      return res.status(400).json({ message: msg.error.default });
    }

    // find the entry
    const entry = await models.BlogEntry.findOne({
      where: {
        id: id,
        authorId: req.user.id,
      }
    });

    // validate if category exists
    const category = await models.BlogCategory.findByPk(req.body.categoryId);
    if(!category) {
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
    entry.categoryId = req.body.categoryId;
    entry.publishedAt = entry.publishedAt // this should not be updated
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

    // find the entry
    const entry = await models.BlogEntry.findOne({
      where: {
        id: id,
        authorId: req.user.id,
      }
    });

    if(!entry) {
      return res.status(400).json({ message: msg.error.default });
    }

    // delete the entry
    await entry.destroy();

    // return the entry
    return res.status(200).json(entry);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}