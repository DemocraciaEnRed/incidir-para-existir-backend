const models = require('../models');
const dayjs = require('dayjs');
const msg = require('../utils/messages');

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

    for(let i = 0; i < 100; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const section = sections[Math.floor(Math.random() * sections.length)];
      const author = authors[Math.floor(Math.random() * authors.length)];

      await models.BlogEntry.create({
        title: `Post ${i + 1}`,
        subtitle: `This is the subtitle for post ${i + 1}`,
        text: `This is the content for post ${i + 1}`,
        imageUrl: 'https://placecats.com/300/200',
        slug: `post-${i + 1}`,
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