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
// POST 	/utils/subdivisions
// -----------------------------------------------


router.get('/subdivisions', 
	UtilsController.getSubdivisions
);

// -----------------------------------------------

router.get('/somethingForUsers',
	authorize(),
	UtilsController.somethingForUsers
)

router.get('/generateBlogPosts',
		UtilsController.generateBlogPosts
)

module.exports = router;