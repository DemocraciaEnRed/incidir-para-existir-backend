const express = require('express');
const { check, param, body, query } = require('express-validator');

const validate = require('../middlewares/validate');
const authorize = require('../middlewares/authorize');
const requiresAnon = require('../middlewares/requiresAnon');
const BlogController = require('../controllers/blogController');
const msg = require('../utils/messages');
const constants = require('../services/constants');
const uploader = require('../middlewares/s3');


// initialize router
const router = express.Router();

// -----------------------------------------------
// BASE   /blog
// -----------------------------------------------
// GET    /
// POST 	/
// -----------------------------------------------


router.get('', 
	[
    query('page').optional().isInt().withMessage(msg.validationError.integer),
    query('limit').optional().isInt().withMessage(msg.validationError.integer),
    query('category').optional().isInt().withMessage(msg.validationError.integer),
    query('section').optional().isInt().withMessage(msg.validationError.integer),
    query('includeUnpublished').optional().isBoolean().withMessage(msg.validationError.boolean),
	], 
  validate,
	BlogController.fetch
);

router.post('/',
  authorize(constants.ROLES.ADMINISTRATOR),
  uploader.single('picture'),
  [
    check('title').isString().withMessage("TODO"),
    check('slug').isString().withMessage("TODO"),
    check('subtitle').isString().withMessage("TODO"),
    check('text').isString().withMessage("TODO"),
    check('categoryId').isString().withMessage("TODO"),
    check('sectionId').isString().withMessage("TODO"),
    check('authorId').isString().withMessage("TODO"),
  ],
  validate,
  BlogController.create
);

router.get('/byId/:id',
  [
    check('id').not().isEmpty().withMessage('id is required'),
  ],
  validate,
  BlogController.fetchOneById
);

router.get('/category',
  [
    query('page').optional().isInt().withMessage(msg.validationError.integer),
    query('limit').optional().isInt().withMessage(msg.validationError.integer),
  ],
  validate,
  BlogController.fetchCategories
)

router.post('/category',
  authorize(constants.ROLES.ADMINISTRATOR),
  [
    body('name').isString().withMessage("El nuevo nombre es requerido"),
  ],
  validate,
  BlogController.createCategory
)

router.put('/category/:id',
  authorize(constants.ROLES.ADMINISTRATOR),
  [
    param('id').not().isEmpty().withMessage('id is required'),
    body('name').isString().withMessage("El nuevo nombre es requerido"),
  ],
  validate,
  BlogController.updateCategory
)

router.delete('/category/:id',
  authorize(constants.ROLES.ADMINISTRATOR),
  [
    param('id').not().isEmpty().withMessage('id is required'),
    body('categoryId').isInt().withMessage("El nuevo nombre es requerido"),
  ],
  validate,
  BlogController.deleteCategory
)

router.get('/section',
  [
    query('page').optional().isInt().withMessage(msg.validationError.integer),
    query('limit').optional().isInt().withMessage(msg.validationError.integer),
  ],
  validate,
  BlogController.fetchSections
)


router.get('/:slug',
  [
		check('slug').not().isEmpty().withMessage('Slug is required'),
  ],
  validate,
  BlogController.fetchOneBySlug
);

router.put('/:id',
  authorize(constants.ROLES.ADMINISTRATOR),
  uploader.single('picture'), 
  [
    check('title').isString().withMessage("TODO"),
    check('slug').isString().withMessage("TODO"),
    check('subtitle').isString().withMessage("TODO"),
    check('text').isString().withMessage("TODO"),
    check('categoryId').isString().withMessage("TODO"),
    check('sectionId').isString().withMessage("TODO"),
    check('authorId').isString().withMessage("TODO"),
  ],
  validate,
  BlogController.update
);

router.delete('/:id',
  authorize(constants.ROLES.ADMINISTRATOR),
  [
    check('id').isInt().withMessage(msg.validationError.integer),
  ],
  validate,
  BlogController.delete
);

router.put('/:id/publish',
  authorize(constants.ROLES.ADMINISTRATOR),
  [
    check('id').isInt().withMessage(msg.validationError.integer),
  ],
  validate,
  BlogController.publish
)

router.put('/:id/unpublish',
  authorize(constants.ROLES.ADMINISTRATOR),
  [
    check('id').isInt().withMessage(msg.validationError.integer),
  ],
  validate,
  BlogController.unpublish
);

router.get('/:id/comments',
  [
    check('id').isInt().withMessage(msg.validationError.integer),
  ],
  validate,
  BlogController.fetchComments
);

router.post('/:id/comments',
  authorize(),
  [
    check('id').isInt().withMessage(msg.validationError.integer),
    check('text').isString().withMessage("Text is required"),
  ],
  validate,
  BlogController.postComment
);

router.delete('/:id/comments/:commentId',
  authorize(),
  [
    check('id').isInt().withMessage(msg.validationError.integer),
    check('commentId').isInt().withMessage(msg.validationError.integer),
  ],
  validate,
  BlogController.deleteComment // updated to the correct controller method
);


router.get('/:id/comments/:commentId/replies',
  [
    check('id').isInt().withMessage(msg.validationError.integer),
    check('commentId').isInt().withMessage(msg.validationError.integer),
  ],
  validate,
  BlogController.fetchReplies
);

router.post('/:id/comments/:commentId/replies',
  authorize(),
  [
    check('id').isInt().withMessage(msg.validationError.integer),
    check('commentId').isInt().withMessage(msg.validationError.integer),
    check('text').isString().withMessage("Text is required"),
  ],
  validate,
  BlogController.postReplyComment
);


module.exports = router;