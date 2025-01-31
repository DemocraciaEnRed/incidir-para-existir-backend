const models = require("../models");
const msg = require('../utils/messages');


exports.fetch = async (req, res) => {
  try {
    // get from query params page and limit (if not provided, default to 1 and 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // calculateOffset
    const offset = (page - 1) * limit;

    const where = {}

    // query the database

    const query = {
      limit: limit,
      offset: offset,
      where: where
    }

    const entries = await models.Resource.findAndCountAll(query)

    // return the entries
    return res.status(200).json(entries);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}