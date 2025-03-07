const models = require('../models');
const dayjs = require('dayjs');
const msg = require('../utils/messages');
const { selectFields } = require('express-validator/lib/field-selection');
const UtilsHelper = require('../helpers/utilsHelper');
const BlogHelper = require('../helpers/blogHelper');
const { Op } = require('sequelize');

exports.fetch = async (req, res) => {
  try {
    // get from query params page and limit (if not provided, default to 1 and 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const categoryId = req.query.category || null;
    const sectionId = req.query.section || null;
    let includeUnpublished = req.query.includeUnpublished || false;
    const isAdmin = UtilsHelper.isAdmin(req.user);

    // calculateOffset
    const offset = (page - 1) * limit;

    const whereQuery = {
      publishedAt: {
        [Op.not]: null
      }
    };

    if(categoryId) {
      whereQuery.categoryId = categoryId;
    }
    if(sectionId) {
      whereQuery.sectionId = sectionId;
    }
    
    if(isAdmin && includeUnpublished) {
      // admin wants to see all. Remove the publishedAt filter
      delete whereQuery.publishedAt;
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
    const entriesJson = JSON.parse(JSON.stringify(entries))

    for(let i = 0; i < entries.rows.length; i++) {
      const totalComments =  await entries.rows[i].getTotalCommentsAndRepliesCount();
      entriesJson.rows[i].totalComments = totalComments;
    }

    // return the entries
    return res.status(200).json(entriesJson);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}

exports.fetchOneBySlug = async (req, res) => {
  try {
    // get query param slug
    const slug = req.params.slug || null;
    const isAdmin = UtilsHelper.isAdmin(req.user);

    if(!slug) {
      return res.status(400).json({ message: msg.error.default });
    }

    const whereQuery = {
      slug,
      publishedAt: {
        [Op.not]: null
      }
    }

    if(isAdmin) {
      // admins can see all. Remove the publishedAt filter
      delete whereQuery.publishedAt;
    }
    
    // find the entry
    const entry = await models.BlogEntry.findOne({
      where: whereQuery,
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
      return res.status(404).send()
    }
    const totalComments =  await entry.getTotalCommentsAndRepliesCount();
    const entryJson = entry.toJSON();
    entryJson.totalComments = totalComments;
    return res.status(200).json( entryJson );
  } catch (error) {
    console.error(error) 
    return res.status(500).json({ message: msg.error.default });
  }
}

exports.fetchOneById = async (req, res) => {
  try {
    // get query param slug
    const id = req.params.id || null;
    const isAdmin = UtilsHelper.isAdmin(req.user);

    if(!id) {
      return res.status(400).json({ message: msg.error.default });
    }

    const whereQuery = {
      id,
      publishedAt: {
        [Op.not]: null
      }
    }

    if(isAdmin) {
      // admins can see all. Remove the publishedAt filter
      delete whereQuery.publishedAt;
    }

    // find the entry
    const entry = await models.BlogEntry.findOne({
      where: whereQuery,
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

    // No entry, return 404
    if(!entry) {
      return res.status(400).json({ message: msg.error.default });
    }

    const totalComments =  await entry.getTotalCommentsAndRepliesCount();
    const entryJson = entry.toJSON();
    entryJson.totalComments = totalComments;

    return res.status(200).json(entryJson);
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: msg.error.default });
  }
}


exports.create = async (req, res) => {
  try {
    // get data from body
    const { title, slug, subtitle, text, categoryId, sectionId, authorId, publishedAt } = req.body;
    
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
      publishedAt,
      authorNotifiedAt: new Date() // Posts made by admins wont be notified.
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

    // find the entry
    const entry = await models.BlogEntry.findByPk(id);

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

exports.publish = async (req, res) => {
  try {
    // get query param slug
    const id = req.params.id || null;

    // find the entry
    const entry = await models.BlogEntry.findByPk(id, {
      include: [
        {
          model: models.User,
          as: 'author',
          attributes: ['email'],
        }
      ]
    });

    if(!entry) {
      return res.status(400).json({ message: msg.error.default });
    }

    // publish the entry
    entry.publishedAt = new Date();

    if(entry.authorNotifiedAt === null) {
      entry.authorNotifiedAt = new Date();
      // send an email to the author
      try {
        console.log('Sending email to author');
        BlogHelper.sendNotificationOfPublishedPostToAuthor(entry.author.email, entry.title);
      } catch (error) {
        console.error('Error sending email to author - Skipping email sending');
        console.error(error);
      }
    }
    await entry.save();

    // return the entry
    return res.status(200).json(entry);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}

exports.unpublish = async (req, res) => {
  try {
    // get query param slug
    const id = req.params.id || null;
    // find the entry
    const entry = await models.BlogEntry.findByPk(id);

    if(!entry) {
      return res.status(400).json({ message: msg.error.default });
    }

    // publish the entry
    entry.publishedAt = null;
    await entry.save();

    // return the entry
    return res.status(200).json(entry);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}


exports.fetchCategories = async (req, res) => {
  try {

    // get from query params page and limit (if not provided, default to 1 and 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // calculateOffset
    const offset = (page - 1) * limit;

    const whereQuery = {};

    const query = {
      limit: limit,
      offset: offset,
      where: whereQuery,
      attributes: ['id', 'name'],
      order: [['createdAt', 'ASC']],
    }

    const entries = await models.BlogCategory.findAndCountAll(query)

    return res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: msg.error.default });
  }
}

exports.createCategory = async (req, res) => {
  try {
    // get all categories
    const { name } = req.body;

    

    const category = await models.BlogCategory.create({
      name
    })

    return res.status(200).json(category);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: msg.error.default });
  }
}

exports.updateCategory = async (req, res) => {
  try {

    const id = req.params.id || null;
    
    // get all categories
    const { name } = req.body;

    const category = await models.BlogCategory.findByPk(id)

    if(!category) {
      return res.status(400).json({ message: msg.error.default });
    }

    category.name = name;
    await category.save()

    return res.status(200).json(category);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: msg.error.default });
  }
}

exports.deleteCategory = async (req, res) => {
  try {

    const id = req.params.id || null;

    // get all categories
    const { categoryId } = req.body;

    const category = await models.BlogCategory.findByPk(id)

    if(!category) {
      return res.status(400).json({ message: msg.error.default });
    }

    const categoryToMigrate = await models.BlogCategory.findByPk(categoryId)

    if(!categoryToMigrate) {
      return res.status(400).json({ message: msg.error.default });
    }

    await models.BlogEntry.update({
      categoryId: categoryToMigrate.id
    }, {
      where: {
        categoryId: category.id
      }
    })

    await category.destroy();

    return res.status(200).send()

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: msg.error.default });
  }
}

exports.fetchSections = async (req, res) => {
  try {
    // get from query params page and limit (if not provided, default to 1 and 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // calculateOffset
    const offset = (page - 1) * limit;

    const whereQuery = {};

    const query = {
      limit: limit,
      offset: offset,
      where: whereQuery,
      attributes: ['id', 'name'],
      order: [['createdAt', 'ASC']],
    }

    const entries = await models.BlogSection.findAndCountAll(query)

    return res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: msg.error.default });
  }
}

exports.fetchComments = async (req, res) => {
try {
    const entryId = req.params.id;

    const comments = await models.Comment.findAll({
      where: { blogEntryId: entryId, commentId: null },
      order: [['createdAt', 'DESC'],['replies', 'createdAt', 'DESC']],
      include: [
        {
          model: models.User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'fullName', 'imageUrl', 'role'],
        },
        {
          model: models.Comment,
          as: 'replies',
          
          include: [
            {
              model: models.User,
              as: 'author',
              attributes: ['id', 'firstName', 'lastName', 'fullName', 'imageUrl', 'role'],
            }
          ]
        }
      ]
    });

    return res.status(200).json(comments);
   
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}

exports.postComment = async (req, res) => {
  try {
    const entryId = req.params.id;
    const { text } = req.body;
    const user = req.user;

    const comment = await models.Comment.create({
      authorId: user.id,
      blogEntryId: entryId,
      commentId: null,
      text: text
    })

    return res.status(201).json(comment);

  } catch (error) {

    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}

exports.fetchReplies = async (req, res) => {
  try {
    const entryId = req.params.id;
    const commentId = req.params.commentId;
    
    const replies = await models.Comment.findAll({
      where: { blogEntryId: entryId, commentId: commentId },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: models.User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'fullName', 'imageUrl', 'role'],
        }
      ]
    });

    return res.status(200).json(replies);
  } catch (error) {
    
  }
}

exports.postReplyComment = async (req, res) => {
  try {
    const entryId = req.params.id;
    const commentId = req.params.commentId;
    const { text } = req.body;
    const user = req.user;

    const comment = await models.Comment.create({
      authorId: user.id,
      blogEntryId: entryId,
      commentId: commentId,
      text: text
    })

    return res.status(201).json(comment);

  } catch (error) {

    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }

}

exports.deleteComment = async (req, res) => {
  const t = await models.sequelize.transaction();
  try {
    const entryId = req.params.id;
    const commentId = req.params.commentId;

    // check if the user is an admin
    const isAdmin = UtilsHelper.isAdmin(req.user);

    // admins can delete other user's comments

    const whereQuery = {
      id: commentId,
      blogEntryId: entryId
    }

    if(!isAdmin) {
      whereQuery.authorId = req.user.id;
    }

    const comment = await models.Comment.findOne({
      where: whereQuery
    });

    if(!comment) {
      return res.status(400).json({ message: msg.error.default });
    }

    // before deleting the comment, delete all replies
    await models.Comment.destroy({
      where: {
        blogEntryId: entryId,
        commentId: comment.id
      },
      transaction: t
    });
    
    await comment.destroy({ transaction: t });

    await t.commit();

    return res.status(200).send({message: 'Comment deleted'});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}