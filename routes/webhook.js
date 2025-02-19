const express = require('express');
const { check, query, body, param } = require('express-validator');

const validate = require('../middlewares/validate');
const authorize = require('../middlewares/authorize');
const requiresAnon = require('../middlewares/requiresAnon');
const BotController = require('../controllers/botController');
const msg = require('../utils/messages');
const constants = require('../services/constants');
const uploader = require('../middlewares/s3');

// initialize router
const router = express.Router();

// -----------------------------------------------
// BASE   /webhook
// -----------------------------------------------
// POST    /whatsapp
// -----------------------------------------------

router.post('/whatsapp',
  BotController.postTwilioWebhook
)


// -----------------------------------------------

module.exports = router;