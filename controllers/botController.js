
const models = require('../models');
const msg = require('../utils/messages');

exports.postTwilioWebhook = async (req, res) => {
  try {
    await models.BotResponse.create({
      payload: req.body
    });

    return res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: msg.error.default });
  }
}
