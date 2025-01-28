const express = require('express');
const { check } = require('express-validator');

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
// GET 	/utils/subdivisions
// GET 	/utils/dimensions
// GET 	/utils/blog-categories
// GET 	/utils/blog-sections

// GET 	/utils/configs
// -----------------------------------------------


router.get('/subdivisions', 
	UtilsController.getSubdivisions
);

router.get('/dimensions', 
	UtilsController.getDimensions
);

router.get('/blog-categories', 
	UtilsController.getBlogCategories
);

router.get('/blog-sections', 
	UtilsController.getBlogSections
);

router.get('/configs', 
	UtilsController.getConfigs
);

router.get('/cities',
	UtilsController.getCities
)

module.exports = router;
