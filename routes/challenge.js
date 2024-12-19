const express = require('express');
const { check } = require('express-validator');

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
// POST   /
// GET    /stats
// -----------------------------------------------

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

router.get('/stats', 
	ChallengeController.stats
);

// -----------------------------------------------

module.exports = router;
