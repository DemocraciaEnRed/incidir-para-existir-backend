const { faker } = require('@faker-js/faker');
const models = require('../models');
const dayjs = require('dayjs');
const msg = require('../utils/messages');
const UtilsHelper = require('../helpers/utilsHelper');
const { Op } = require('sequelize');

exports.getStats = async (req, res) => {
  try {
    const stats = {
      totalUsers: await models.User.count(),
      usersVerified: await models.User.count({ where: { emailVerified: true } }),
      usersNotVerified: 0,
      totalEntries: await models.BlogEntry.count(),
      totalChallenges: await models.Challenge.count(),
      totalInitiatives: await models.Initiative.count(),
      totalInitiativesPublished: await models.Initiative.count({ where: { publishedAt: { [Op.ne]: null } } }),
      totalInitiativesUnpublished: 0,
    }

    stats.usersNotVerified = stats.totalUsers - stats.usersVerified;
    stats.totalInitiativesUnpublished = stats.totalInitiatives - stats.totalInitiativesPublished;

    return res.status(200).json(stats);

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: msg.error.default })
  }
}