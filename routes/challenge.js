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
// GET    /:id
// DELETE	/:id
// GET    /stats/chart/count-by-subdivision/:cityId?
// -----------------------------------------------

router.get('/',
	[
		 query('page').optional().isInt().withMessage(msg.validationError.integer),
			query('limit').optional().isInt().withMessage(msg.validationError.integer),
			query('dimension.*').optional().isInt().withMessage(msg.validationError.integer),
		query('subdivision.*').optional().isInt().withMessage(msg.validationError.string),
	], 
	validate,
	ChallengeController.fetch
)

router.post('/', 
	[
		check('dimensionId').isInt().withMessage(msg.validationError.integer),
		check('subdivisionId').isInt().withMessage(msg.validationError.integer),
		check('latitude').optional().isDecimal().withMessage(msg.validationError.defaultMessage),
		check('longitude').optional().isDecimal().withMessage(msg.validationError.defaultMessage),
		check('recaptchaResponse').isString().withMessage(msg.validationError.string),
		check('needsAndChallenges').isString().withMessage(msg.validationError.string),
		check('proposal').isString().withMessage(msg.validationError.string),
		check('inWords').isString().withMessage(msg.validationError.string),
	], 
	validate,
	ChallengeController.create
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
		body('subdivisionId').isInt().withMessage(msg.validationError.integer),
		check('latitude').optional().isDecimal().withMessage(msg.validationError.defaultMessage),
		check('longitude').optional().isDecimal().withMessage(msg.validationError.defaultMessage),
		body('needsAndChallenges').isString().withMessage(msg.validationError.string),
		body('proposal').isString().withMessage(msg.validationError.string),
		body('inWords').isString().withMessage(msg.validationError.string),
	],
	validate,
	ChallengeController.update
);

router.delete('/:id',
	[
		param('id').isInt().withMessage(msg.validationError.integer),
	],
	validate,
	ChallengeController.delete
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

// -----------------------------------------------

module.exports = router;
