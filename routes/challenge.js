const express = require('express');
const { check,query, param, body } = require('express-validator');

const validate = require('../middlewares/validate');
const authorize = require('../middlewares/authorize');
const requiresAnon = require('../middlewares/requiresAnon');
const ChallengeController = require('../controllers/challengeController');
const msg = require('../utils/messages');
const constants = require('../services/constants');

// initialize router
const router = express.Router();

// -----------------------------------------------
// BASE   /challenges
// -----------------------------------------------
// GET   	/
// POST   /
// PÓST 	/csv
// GET    /:id
// DELETE	/:id
// GET    /stats/chart/count-by-subdivision/:cityId?
// -----------------------------------------------

router.get('/',
	[
		query('page').optional().isInt().withMessage(msg.validationError.integer),
		query('limit').optional().isInt().withMessage(msg.validationError.integer),
		query('dimension.*').optional().isInt().withMessage(msg.validationError.integer),
		query('city').optional().isInt().withMessage(msg.validationError.integer),
		query('subdivision').optional().isInt().withMessage(msg.validationError.string),
	], 
	validate,
	ChallengeController.fetch
)

router.post('/', 
	[
		check('dimensionId').isInt().withMessage(msg.validationError.integer),
		check('cityId').isInt().withMessage(msg.validationError.integer),
		check('subdivisionId').optional().isInt().withMessage(msg.validationError.integer),		check('latitude').optional().isDecimal().withMessage(msg.validationError.defaultMessage),
		check('longitude').optional().isDecimal().withMessage(msg.validationError.defaultMessage),
		check('source').isString().withMessage(msg.validationError.string),
		check('needsAndChallenges').isString().withMessage(msg.validationError.string),
		check('proposal').optional().isString().withMessage(msg.validationError.string),
		check('inWords').isString().withMessage(msg.validationError.string),
		check('recaptchaResponse').isString().withMessage(msg.validationError.string),
	], 
	validate,
	ChallengeController.create
);

router.post('/csv',
	[
		check('recaptchaResponse').isString().withMessage(msg.validationError.string),
	],
	validate,
	ChallengeController.downloadChallengesCsv
);

router.get('/list/geolocalized',
	ChallengeController.fetchAllGeolocalized
);

router.get('/:id',
	[
		param('id').isInt().withMessage(msg.validationError.integer),
	],
	validate,
	ChallengeController.fetchOne
);

router.put('/:id',
	authorize(constants.ROLES.ADMINISTRATOR),
	[
		param('id').isInt().withMessage(msg.validationError.integer),
		body('dimensionId').isInt().withMessage(msg.validationError.integer),
		body('cityId').isInt().withMessage(msg.validationError.integer),
		body('subdivisionId').optional().isInt().withMessage(msg.validationError.integer),
		body('latitude').optional().isDecimal().withMessage(msg.validationError.defaultMessage),
		body('longitude').optional().isDecimal().withMessage(msg.validationError.defaultMessage),
		body('source').isString().withMessage(msg.validationError.string),
		body('needsAndChallenges').isString().withMessage(msg.validationError.string),
		body('proposal').optional().isString().withMessage(msg.validationError.string),
		body('inWords').isString().withMessage(msg.validationError.string),
	],
	validate,
	ChallengeController.update
);

router.delete('/:id',
	authorize(constants.ROLES.ADMINISTRATOR),
	[
		param('id').isInt().withMessage(msg.validationError.integer),
	],
	validate,
	ChallengeController.delete
);

router.put('/:id/publish',
	authorize(constants.ROLES.ADMINISTRATOR),
	[
		check('id').isInt().withMessage(msg.validationError.integer),
	],
	validate,
	ChallengeController.publish
);

router.put('/:id/unpublish',
	authorize(constants.ROLES.ADMINISTRATOR),
	[
		check('id').isInt().withMessage(msg.validationError.integer),
	],
	validate,
	ChallengeController.unpublish
);

router.get('/stats/chart/count-by-subdivision/:cityId?',
	[
		param('cityId').optional().isInt().withMessage(msg.validationError.integer),
	],
	ChallengeController.statsChartCountBySubdivision
);

router.get('/stats/chart/count-by-dimension', 
	ChallengeController.statsChartCountByDimension
);

router.get('/stats/bar/count-by-dimension', 
	ChallengeController.statsCountByDimensionBar
);

// -----------------------------------------------

module.exports = router;
