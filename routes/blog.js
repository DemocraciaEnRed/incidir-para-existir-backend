const express = require('express');
const { check, query } = require('express-validator');

const validate = require('../middlewares/validate');
const authorize = require('../middlewares/authorize');
const requiresAnon = require('../middlewares/requiresAnon');
const BlogController = require('../controllers/blogController');
const msg = require('../utils/messages');

// initialize router
const router = express.Router();

// -----------------------------------------------
// BASE   /blog
// -----------------------------------------------
// POST 	/blog
// -----------------------------------------------


router.get('', 
	[
    query('category').optional().isInt().withMessage(msg.validationError.integer),
    query('section').optional().isInt().withMessage(msg.validationError.integer),
	], 
	BlogController.getAll
);

router.get('/:slug',
  [
		check('token').not().isEmpty().withMessage('Slug is required'),

  ],
  BlogController.getOne
);

module.exports = router;