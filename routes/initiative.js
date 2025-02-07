const express = require('express');
const { param, query, check } = require('express-validator');

const validate = require('../middlewares/validate');
const authorize = require('../middlewares/authorize');
const constants = require('../services/constants');
const requiresAnon = require('../middlewares/requiresAnon');
const InitiativeController = require('../controllers/initiativeController');
const msg = require('../utils/messages');

// initialize router
const router = express.Router();

// -----------------------------------------------
// BASE   /initiatives
// -----------------------------------------------
// POST   /
// GET    /stats
// -----------------------------------------------

router.get('/',
  [
    query('page').optional().isInt().withMessage(msg.validationError.integer),
    query('limit').optional().isInt().withMessage(msg.validationError.integer),
    query('dimension.*').optional().isInt().withMessage(msg.validationError.integer),
    query('includeUnpublished').optional().isBoolean().withMessage(msg.validationError.string),
    query('city').optional().isInt().withMessage(msg.validationError.integer),
    query('subdivision').optional().isInt().withMessage(msg.validationError.string),
    query('q').optional().isString().withMessage(msg.validationError.string),
  ], 
  validate,
  InitiativeController.fetch
)

router.post('/',
  [
    check('name').isString().withMessage(msg.validationError.string),
    check('description').isString().withMessage(msg.validationError.string),
    check('needsAndOffers').isString().withMessage(msg.validationError.string),
    check('dimensionIds').isArray().withMessage(msg.validationError.defaultMessage),
    check('dimensionIds.*').isInt().withMessage(msg.validationError.integer),
    check('subdivisionId').isInt().withMessage(msg.validationError.integer),
    check('latitude').optional().isDecimal().withMessage(msg.validationError.defaultMessage),
    check('longitude').optional().isDecimal().withMessage(msg.validationError.defaultMessage),
    check('recaptchaResponse').isString().withMessage(msg.validationError.string),
    check('contact').isObject().withMessage(msg.validationError.defaultMessage),
    check('contact.fullname').isString().withMessage(msg.validationError.string),
    check('contact.email').isEmail().withMessage(msg.validationError.email),
    check('contact.keepEmailPrivate').isBoolean().withMessage(msg.validationError.boolean),
    check('contact.phone').optional().isString().withMessage(msg.validationError.string),
    check('contact.keepPhonePrivate').isBoolean().withMessage(msg.validationError.boolean),
  ], 
  validate,
  InitiativeController.create
);

router.post('/csv',
  [
    check('recaptchaResponse').isString().withMessage(msg.validationError.string),
  ],
  validate,
  InitiativeController.downloadInitiativesCsv
);

router.get('/list/geolocalized',
  InitiativeController.fetchAllGeolocalized
);

router.get('/:id',
  [
    check('id').isInt().withMessage(msg.validationError.integer),
  ],
  validate,
  InitiativeController.fetchOne
);

router.put('/:id',
  authorize(constants.ROLES.ADMINISTRATOR),
  [
    param('id').isInt().withMessage(msg.validationError.integer),
    check('name').isString().withMessage(msg.validationError.string),
    check('description').isString().withMessage(msg.validationError.string),
    check('needsAndOffers').isString().withMessage(msg.validationError.string),
    check('dimensionIds').isArray().withMessage(msg.validationError.defaultMessage),
    check('dimensionIds.*').isInt().withMessage(msg.validationError.integer),
    check('subdivisionId').isInt().withMessage(msg.validationError.integer),
    check('latitude').optional().isDecimal().withMessage(msg.validationError.defaultMessage),
    check('longitude').optional().isDecimal().withMessage(msg.validationError.defaultMessage),
    check('recaptchaResponse').isString().withMessage(msg.validationError.string),
    check('contact').isObject().withMessage(msg.validationError.defaultMessage),
    check('contact.fullname').isString().withMessage(msg.validationError.string),
    check('contact.email').isEmail().withMessage(msg.validationError.email),
    check('contact.keepEmailPrivate').isBoolean().withMessage(msg.validationError.boolean),
    check('contact.phone').optional().isString().withMessage(msg.validationError.string),
    check('contact.keepPhonePrivate').isBoolean().withMessage(msg.validationError.boolean),
  ], 
  validate,
  InitiativeController.update
);

router.delete('/:id',
  authorize(constants.ROLES.ADMINISTRATOR),
  [
    check('id').isInt().withMessage(msg.validationError.integer),
  ],
  validate,
  InitiativeController.delete
);

router.put('/:id/publish',
  authorize(constants.ROLES.ADMINISTRATOR),
  [
    check('id').isInt().withMessage(msg.validationError.integer),
  ],
  validate,
  InitiativeController.publish
);

router.put('/:id/unpublish',
  authorize(constants.ROLES.ADMINISTRATOR),
  [
    check('id').isInt().withMessage(msg.validationError.integer),
  ],
  validate,
  InitiativeController.unpublish
);

router.get('/stats/chart/count-by-subdivision/:cityId?',
  [
    param('cityId').optional().isInt().withMessage(msg.validationError.integer),
  ],
  InitiativeController.statsChartCountBySubdivision
);

router.get('/stats/chart/count-by-dimension', 
  InitiativeController.statsChartCountByDimension
);

router.get('/stats/bar/count-by-dimension', 
  InitiativeController.statsCountByDimensionBar
);

// router.get('/stats', 
//   InitiativeController.stats
// );

// -----------------------------------------------

module.exports = router;
