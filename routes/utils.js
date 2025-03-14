const express = require('express');
const { check, query, body } = require('express-validator');

const validate = require('../middlewares/validate');
const authorize = require('../middlewares/authorize');
const requiresAnon = require('../middlewares/requiresAnon');
const UtilsController = require('../controllers/utilsController');
const msg = require('../utils/messages');

// initialize router
const router = express.Router();

// -----------------------------------------------
// BASE     /utils
// -----------------------------------------------
// GET 	/utils/cities
// GET 	/utils/subdivisions
// GET 	/utils/dimensions
// GET 	/utils/blog-categories
// GET 	/utils/blog-sections
// GET 	/utils/configs
// POST /utils/contact
// -----------------------------------------------


router.get('/cities',
	UtilsController.getCities
);

router.get('/subdivisions', 
	UtilsController.getSubdivisions
);

router.get('/dimensions', 
	UtilsController.getDimensions
);

router.get('/configs', 
	[
		check('key').isString(),
	],
	UtilsController.getConfigs
);

router.put('/configs', 
	[
		body('key').isString(),
		body('type').optional().isString(),
		body('value').isString(),
	],
	validate,
	UtilsController.setConfigs
);

router.post('/contact', 
	[
		body('fullname').isString(),
		body('email').isEmail(),
		body('message').isString(),
		body('recaptchaResponse').isString().withMessage(msg.validationError.string),
	],
	validate,
	UtilsController.postContact
);

module.exports = router;
