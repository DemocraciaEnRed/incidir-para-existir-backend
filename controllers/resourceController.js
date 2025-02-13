const models = require("../models");
const msg = require('../utils/messages');


exports.fetch = async (req, res) => {
  try {
    // get from query params page and limit (if not provided, default to 1 and 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category || null;
    
    // calculateOffset
    const offset = (page - 1) * limit;

    const where = {}

    if(category) {
      where.categoryId = category;
    }

    // query the database

    const query = {
      limit: limit,
      offset: offset,
      where: where,
      include: [
        {
          model: models.ResourceCategory,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
      order: [['updatedAt', 'DESC']],
    }

    const entries = await models.ResourceEntry.findAndCountAll(query)

    // return the entries
    return res.status(200).json(entries);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}

exports.fetchOne = async (req, res) => {
  try {
    const id = req.params.id || null;

    const entry = await models.ResourceEntry.findByPk(id, {
      include: [
        {
          model: models.ResourceCategory,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    })

    if(!entry) {
      return res.status(400).json({ message: msg.error.default });
    }

    return res.status(200).json(entry);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}

exports.create = async (req, res) => {
  try {
    const { title, description, url, categoryId } = req.body;
    
    // check the category id exists

    const category = await models.ResourceCategory.findByPk(categoryId)

    if(!category) {
      return res.status(400).json({ message: msg.error.default });
    }

    const entry = await models.ResourceEntry.create({
      title,
      categoryId,
      description: description || null,
      url
    })

    return res.status(200).json(entry);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}

exports.update = async (req, res) => {
  try {
    const id = req.params.id || null;
    const { title, description, url, categoryId } = req.body;
    
    const category = await models.ResourceCategory.findByPk(categoryId)

    if(!category) {
      return res.status(400).json({ message: msg.error.default });
    }

    const entry = await models.ResourceEntry.findByPk(id)

    if(!entry) {
      return res.status(400).json({ message: msg.error.default });
    }


    entry.title = title;
    entry.categoryId = categoryId;
    entry.description = description;
    entry.url = url;
    await entry.save()

    return res.status(200).json(entry);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}

exports.delete = async (req, res) => {
  try {
    const id = req.params.id || null;

    const entry = await models.ResourceEntry.findByPk(id)

    if(!entry) {
      return res.status(400).json({ message: msg.error.default });
    }

    await entry.destroy();

    return res.status(200).send()
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}

exports.fetchCategories = async (req, res) => {
  try {
    const categories = await models.ResourceCategory.findAll({
      attributes: ['id', 'name'],
    });

    return res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}


exports.createCategory = async (req, res) => {
  try {
    // get all categories
    const { name } = req.body;

    

    const category = await models.ResourceCategory.create({
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

    const category = await models.ResourceCategory.findByPk(id)

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

    const category = await models.ResourceCategory.findByPk(id)

    if(!category) {
      return res.status(400).json({ message: msg.error.default });
    }

    const categoryToMigrate = await models.ResourceCategory.findByPk(categoryId)

    if(!categoryToMigrate) {
      return res.status(400).json({ message: msg.error.default });
    }

    await models.ResourceEntry.update({
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