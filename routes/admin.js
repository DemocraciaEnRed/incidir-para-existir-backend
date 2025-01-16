const express = require('express');
const { check } = require('express-validator');

const validate = require('../middlewares/validate');
const authorize = require('../middlewares/authorize');
const requiresAnon = require('../middlewares/requiresAnon');
const adminController = require('../controllers/adminController');
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
  adminController.getStats
)
// -----------------------------------------------

module.exports = router;
