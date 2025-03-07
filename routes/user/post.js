const express = require('express');
const { check, param, body, query } = require('express-validator');

const validate = require('../../middlewares/validate');
const authorize = require('../../middlewares/authorize');
const requiresAnon = require('../../middlewares/requiresAnon');
const UserPostController = require('../../controllers/userPostController');
const msg = require('../../utils/messages');
const constants = require('../../services/constants');
const uploader = require('../../middlewares/s3');


// initialize router
const router = express.Router();

// -----------------------------------------------
// BASE   /users/posts
// -----------------------------------------------
// GET    /
// POST 	/
// PUT    /:id
// DELETE /:id
// -----------------------------------------------


router.get('', 
  authorize(),
  [
    query('page').optional().isInt().withMessage(msg.validationError.integer),
    query('limit').optional().isInt().withMessage(msg.validationError.integer),
    query('category').optional().isInt().withMessage(msg.validationError.integer),
  ], 
  validate,
  UserPostController.fetch
);

router.post('/',
  authorize(),
  uploader.single('picture'),
  [
    check('title').isString().withMessage("TODO"),
    check('slug').isString().withMessage("TODO"),
    check('subtitle').isString().withMessage("TODO"),
    check('text').isString().withMessage("TODO"),
    check('categoryId').isString().withMessage("TODO"),
  ],
  validate,
  UserPostController.create
);


router.get('/:id',
  [
    check('id').not().isEmpty().withMessage('id is required'),
  ],
  validate,
  UserPostController.fetchOneById
);

router.put('/:id',
  authorize(),
  uploader.single('picture'), 
  [
    check('title').isString().withMessage("TODO"),
    check('slug').isString().withMessage("TODO"),
    check('subtitle').isString().withMessage("TODO"),
    check('text').isString().withMessage("TODO"),
    check('categoryId').isString().withMessage("TODO"),
  ],
  validate,
  UserPostController.update
);

router.delete('/:id',
  authorize(),
  [
    check('id').isInt().withMessage(msg.validationError.integer),
  ],
  validate,
  UserPostController.delete
);



module.exports = router;