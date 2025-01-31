const express = require('express');
const { check, query } = require('express-validator');

const validate = require('../middlewares/validate');
const authorize = require('../middlewares/authorize');
const requiresAnon = require('../middlewares/requiresAnon');
const constants = require('../services/constants');
const ResourceController = require('../controllers/memberController');
const msg = require('../utils/messages');
const uploader = require('../middlewares/s3');

// initialize router
const router = express.Router();

// -----------------------------------------------
// BASE   /resources
// -----------------------------------------------
// GET      /
// POST     /
// GET      /:id
// PUT      /:id
// DELETE   /:id
// -----------------------------------------------

// -----------------------------------------------

module.exports = router;
