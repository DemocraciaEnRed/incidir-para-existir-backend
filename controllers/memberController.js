const models = require("../models");
const msg = require('../utils/messages');


exports.fetch = async (req, res) => {
  try {
    // get from query params page and limit (if not provided, default to 1 and 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const team = req.query.team || null;
    
    // calculateOffset
    const offset = (page - 1) * limit;

    const where = {}

    if(team) {
      where.team = team;
    }

    // query the database

    const query = {
      limit: limit,
      offset: offset,
      where: where
    }

    const entries = await models.Member.findAndCountAll(query)

    // return the entries
    return res.status(200).json(entries);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}

exports.fetchAll = async (req, res) => {
  try {
    const team = req.query.team || null;

    // where
    const where = {}

    if(team) {
      where.team = team;
    }
    
    const entries = await models.Member.findAll({
      where: where
    })

    return res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}

exports.fetchOne = async (req, res) => {
  try {
    // get query param slug
    const id = req.params.id || null;

    if(!id) {
      return res.status(400).json({ message: msg.error.default });
    }

    // find the entry
    const entry = await models.Member.findOne({ where: { id } });

    // return the entry
    return res.status(200).json(entry);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}

exports.create = async (req, res) => {
  try {
    const member = {
      fullname: req.body.fullname,
      team: req.body.team,
      bio: req.body.bio,
      imageUrl: req.file ? req.file.location : null,
      linkedin: req.body.linkedin || null,
      twitter: req.body.twitter || null,
      instagram: req.body.instagram || null,
      tiktok: req.body.tiktok || null
    }

    // create the entry
    const entry = await models.Member.create(member);

    // return the entry
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
    const entry = await models.Member.findOne({ where: { id } });

    // update the entry
    entry.fullname = req.body.fullname;
    entry.team = req.body.team;
    entry.bio = req.body.bio;
    if(req.file){
      entry.imageUrl = req.file.location;
    }
    entry.linkedin = req.body.linkedin || null;
    entry.twitter = req.body.twitter || null;
    entry.instagram = req.body.instagram || null;
    entry.tiktok = req.body.tiktok || null;

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
    const entry = await models.Member.findByPk(id);

    // delete the entry
    await entry.destroy();

    // return the entry
    return res.status(200).json(entry);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}