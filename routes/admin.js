const express = require('express');
const { check } = require('express-validator');

const validate = require('../middlewares/validate');
const authorize = require('../middlewares/authorize');
const requiresAnon = require('../middlewares/requiresAnon');
const AdminController = require('../controllers/adminController');
const msg = require('../utils/messages');
const constants = require('../services/constants');

// initialize router
const router = express.Router();

// -----------------------------------------------
// BASE   /admin
// -----------------------------------------------
// POST   /
// GET    /stats
// -----------------------------------------------

router.get('/stats',
  authorize(constants.ROLES.ADMINISTRATOR),
  AdminController.getStats
)

router.get('/simple-stats',
  authorize(constants.ROLES.ADMINISTRATOR),
  AdminController.getSimpleStats
)

router.get('/initiatives/csv',
  authorize(constants.ROLES.ADMINISTRATOR),
  AdminController.getInitiativesCsv
)

router.get('/challenges/csv',
  authorize(constants.ROLES.ADMINISTRATOR),
  AdminController.getChallengesCsv
)

router.get('/bot-responses',
  authorize(constants.ROLES.ADMINISTRATOR),
  AdminController.listBotResponses
)

// -----------------------------------------------

module.exports = router;
