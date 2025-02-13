const express = require('express');
const { check, query, body, param } = require('express-validator');

const validate = require('../middlewares/validate');
const authorize = require('../middlewares/authorize');
const requiresAnon = require('../middlewares/requiresAnon');
const constants = require('../services/constants');
const ResourceController = require('../controllers/resourceController');
const msg = require('../utils/messages');
const uploader = require('../middlewares/s3');

// initialize router
const router = express.Router();

// -----------------------------------------------
// BASE   /resources
// -----------------------------------------------
// GET      /
// POST     /
// GET      /:id
// PUT      /:id
// DELETE   /:id
// -----------------------------------------------
router.get('/',
  [
    query('page').optional().isInt().withMessage(msg.validationError.integer),
    query('limit').optional().isInt().withMessage(msg.validationError.integer),
    query('category').optional().isInt().withMessage(msg.validationError.integer),
  ], 
  validate,
  ResourceController.fetch
)

router.post('/',
  authorize(constants.ROLES.ADMINISTRATOR),
  [
    check('title').isString().withMessage("TODO"),
    check('categoryId').isInt().withMessage("TODO"),
    check('description').optional().isString().withMessage("TODO"),
    check('url').isURL().withMessage("Debe ser una URL válida"),
  ],
  validate,
  ResourceController.create
)


router.get('/category',
  ResourceController.fetchCategories
)

router.post('/category',
  authorize(constants.ROLES.ADMINISTRATOR),
  [
    body('name').isString().withMessage("El nuevo nombre es requerido"),
  ],
  validate,
  ResourceController.createCategory
)

router.put('/category/:id',
  authorize(constants.ROLES.ADMINISTRATOR),
  [
    param('id').not().isEmpty().withMessage('id is required'),
    body('name').isString().withMessage("El nuevo nombre es requerido"),
  ],
  validate,
  ResourceController.updateCategory
)

router.delete('/category/:id',
  authorize(constants.ROLES.ADMINISTRATOR),
  [
    param('id').not().isEmpty().withMessage('id is required'),
    body('categoryId').isInt().withMessage("El nuevo nombre es requerido"),
  ],
  validate,
  ResourceController.deleteCategory
)

router.get('/:id',
  [
    check('id').isInt().withMessage(msg.validationError.integer),
  ],
  validate,
  ResourceController.fetchOne
);


router.put('/:id',
  authorize(constants.ROLES.ADMINISTRATOR),
  [
    check('title').isString().withMessage("TODO"),
    check('categoryId').isInt().withMessage("TODO"),
    check('description').optional().isString().withMessage("TODO"),
    check('url').isURL().withMessage("Debe ser una URL válida"),
  ],
  validate,
  ResourceController.update
);

router.delete('/:id',
  authorize(constants.ROLES.ADMINISTRATOR),
  [
    check('id').isInt().withMessage(msg.validationError.integer),
  ],
  validate,
  ResourceController.delete
);


// -----------------------------------------------

module.exports = router;
