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
    query('page').optional().isInt().withMessage(msg.validationError.integer),
    query('limit').optional().isInt().withMessage(msg.validationError.integer),
    query('category').optional().isInt().withMessage(msg.validationError.integer),
    query('section').optional().isInt().withMessage(msg.validationError.integer),
	], 
  validate,
	BlogController.fetch
);

router.get('/:slug',
  [
		check('slug').not().isEmpty().withMessage('Slug is required'),
  ],
  validate,
  BlogController.fetchOne
);

module.exports = router;