const express = require('express');
const { check } = require('express-validator');

const validate = require('../middlewares/validate');
const authorize = require('../middlewares/authorize');
const requiresAnon = require('../middlewares/requiresAnon');
const InitiativeController = require('../controllers/initiativeController');
const msg = require('../utils/messages');

// initialize router
const router = express.Router();

// -----------------------------------------------
// BASE   /challenges
// -----------------------------------------------
// POST   /
// GET    /stats
// -----------------------------------------------

router.post('/',
  authorize(),
  [
    check('name').isString().withMessage(msg.validationError.string),
    check('description').isString().withMessage(msg.validationError.string),
    check('needsAndOffers').isString().withMessage(msg.validationError.string),
    check('dimensionIds').isArray().withMessage(msg.validationError.defaultMessage),
    check('dimensionIds.*').isInt().withMessage(msg.validationError.integer),
    check('subdivisionId').isInt().withMessage(msg.validationError.integer),
    check('contact').isObject().withMessage(msg.validationError.defaultMessage),
    check('contact.fullname').isString().withMessage(msg.validationError.string),
    check('contact.email').isEmail().withMessage(msg.validationError.email),
    check('contact.phone').optional().isString().withMessage(msg.validationError.string),
    check('contact.keepPrivate').isBoolean().withMessage(msg.validationError.boolean),
  ], 
  validate,
  InitiativeController.create
);

// router.get('/stats', 
//   InitiativeController.stats
// );

// -----------------------------------------------

module.exports = router;
