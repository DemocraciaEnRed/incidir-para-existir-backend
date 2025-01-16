const express = require('express');
const { check, query } = require('express-validator');

const validate = require('../middlewares/validate');
const authorize = require('../middlewares/authorize');
const requiresAnon = require('../middlewares/requiresAnon');
const constants = require('../services/constants');
const MemberController = require('../controllers/memberController');
const msg = require('../utils/messages');
const uploader = require('../middlewares/s3');

// initialize router
const router = express.Router();

// -----------------------------------------------
// BASE   /members
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
    query('team').optional().isString().withMessage(msg.validationError.string),
  ], 
  validate,
  MemberController.fetch
);

router.get('/all',
  [
    query('team').optional().isString().withMessage(msg.validationError.string),
  ], 
  validate,
  MemberController.fetchAll
)

router.post('/',
  authorize(constants.ROLES.ADMINISTRATOR),
  uploader.single('picture'),
  [
    check('fullname').isString().withMessage("TODO"),
    check('team').isString().withMessage("TODO"),
    check('bio').isString().withMessage("TODO"),
    check('linkedin').optional().isURL().withMessage("TODO"),
    check('twitter').optional().isURL().withMessage("TODO"),
    check('instagram').optional().isURL().withMessage("TODO"),
    check('tiktok').optional().isURL().withMessage("TODO")
  ],
  validate,
  MemberController.create
)

router.get('/:id',
  [
    check('id').isInt().withMessage(msg.validationError.integer),
  ],
  validate,
  MemberController.fetchOne
);

router.put('/:id',
  authorize(constants.ROLES.ADMINISTRATOR),
  uploader.single('picture'), 
  [
    check('fullname').isString().withMessage("TODO"),
    check('team').isString().withMessage("TODO"),
    check('bio').isString().withMessage("TODO"),
    check('linkedin').optional().isURL().withMessage("TODO"),
    check('twitter').optional().isURL().withMessage("TODO"),
    check('instagram').optional().isURL().withMessage("TODO"),
    check('tiktok').optional().isURL().withMessage("TODO")
  ],
  validate,
  MemberController.update
);


router.delete('/:id',
  authorize(constants.ROLES.ADMINISTRATOR),
  [
    check('id').isInt().withMessage(msg.validationError.integer),
  ],
  validate,
  MemberController.delete
);

// -----------------------------------------------

module.exports = router;
