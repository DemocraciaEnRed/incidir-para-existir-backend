const express = require('express');
const { check, query } = require('express-validator');

const validate = require('../middlewares/validate');
const authorize = require('../middlewares/authorize');
const requiresAnon = require('../middlewares/requiresAnon');
const userController = require('../controllers/userController');
const msg = require('../utils/messages');
const constants = require('../services/constants');

// initialize router
const router = express.Router();

// -----------------------------------------------
// BASE   /user
// -----------------------------------------------
// GET   /
// GET    /setup?magic=
// POST   /setup
// -----------------------------------------------

router.get('/',
  authorize(constants.ROLES.ADMINISTRATOR),
  [
    query('page').optional().isInt().withMessage(msg.validationError.integer),
    query('limit').optional().isInt().withMessage(msg.validationError.integer),
  ], 
  validate,
  userController.fetch
)

router.get('/setup',
  requiresAnon,
  [
    query('magic').optional().isString().isLength({ min: 1 }),
  ],
  validate,
  userController.getSetup
)
// -----------------------------------------------

router.post('/setup',
  requiresAnon,
  [
    check('firstName').isString(),
    check('lastName').isString(),
    check('email').isEmail(),
    check('password').isString(),
    check('magic').isString(),
  ],
  validate,
  userController.postSetup
)

module.exports = router;
