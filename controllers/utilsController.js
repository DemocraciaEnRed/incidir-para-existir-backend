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

exports.somethingForUsers = async (req, res) => {
  try {
    console.log('req.user', req.user);
    console.log('got here!')
    return res.status(200).json({ message: 'This is something for users' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: msg.error.default });
  }
}

exports.generateBlogPosts = async (req, res) => {
  try {
    const categories = await models.BlogCategory.findAll();
    const sections = await models.BlogSection.findAll();
    const authors = await models.User.findAll();

    for(let i = 0; i < 50; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const section = sections[Math.floor(Math.random() * sections.length)];
      const author = authors[Math.floor(Math.random() * authors.length)];

      await models.BlogEntry.create({
        title: faker.lorem.words({min: 8, max: 16}),
        subtitle: faker.lorem.sentence(16),
        text: faker.lorem.paragraphs({min: 12, max: 24}),
        imageUrl: faker.image.urlPicsumPhotos({ width: 1024, height: 768, grayscale: false, blur: 0 }),
        slug: faker.lorem.slug(5),
        authorId: author.id,
        categoryId: category.id,
        sectionId: section.id,
        publishedAt: dayjs().subtract(Math.floor(Math.random() * 365), 'day').toDate(),
      });
    }

    return res.status(200).json({ message: 'Blog posts created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: msg.error.default });
  }
}