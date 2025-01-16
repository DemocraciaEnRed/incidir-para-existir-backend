const express = require('express');
const { check,query } = require('express-validator');

const validate = require('../middlewares/validate');
const authorize = require('../middlewares/authorize');
const requiresAnon = require('../middlewares/requiresAnon');
const ChallengeController = require('../controllers/challengeController');
const msg = require('../utils/messages');

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
		query('dimension').optional().isInt().withMessage(msg.validationError.integer),
		query('subdivision').optional().isInt().withMessage(msg.validationError.string),
	], 
	validate,
	ChallengeController.fetch
)

router.post('/', 
	[
		check('dimensionId').isInt().withMessage(msg.validationError.integer),
		check('subdivisionId').isInt().withMessage(msg.validationError.integer),
		check('needsAndChallenges').isString().withMessage(msg.validationError.string),
		check('proposal').isString().withMessage(msg.validationError.string),
		check('inWords').isString().withMessage(msg.validationError.string),
	], 
	validate,
	ChallengeController.create
);

router.delete('/:id',
	[
		check('id').isInt().withMessage(msg.validationError.integer),
	],
	validate,
	ChallengeController.delete
);

router.get('/:id',
	[
		check('id').isInt().withMessage(msg.validationError.integer),
	],
	validate,
	ChallengeController.fetchOne
);

router.get('/stats/chart/count-by-subdivision/:cityId?',
	[
		check('cityId').optional().isInt().withMessage(msg.validationError.integer),
	],
	ChallengeController.statsChartCountBySubdivision
);

router.get('/stats/chart/count-by-dimension', 
	ChallengeController.statsChartCountByDimension
);

// -----------------------------------------------

module.exports = router;
