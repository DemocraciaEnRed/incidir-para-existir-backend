const express = require('express');
const { check, query, body, param } = require('express-validator');

const validate = require('../../middlewares/validate');
const authorize = require('../../middlewares/authorize');
const requiresAnon = require('../../middlewares/requiresAnon');
const UserController = require('../../controllers/userController');
const msg = require('../../utils/messages');
const constants = require('../../services/constants');
const uploader = require('../../middlewares/s3');
const userPostsRouter = require('./post');

// initialize router
const router = express.Router({mergeParams: true});

// -----------------------------------------------
// BASE   /user
// -----------------------------------------------
// GET    /
// POST   /
// GET    /all
// GET    /setup?magic=
// POST   /setup
// ROUTER /posts
// GET    /:id
// PUT    /:id
// PUT    /:id/enable
// PUT    /:id/disable
// -----------------------------------------------

router.get('/',
  authorize(constants.ROLES.ADMINISTRATOR),
  [
    query('page').optional().isInt().withMessage(msg.validationError.integer),
    query('limit').optional().isInt().withMessage(msg.validationError.integer),
  ], 
  validate,
  UserController.fetch
)

router.post('/', 
  authorize(constants.ROLES.ADMINISTRATOR),
  [
    check('firstName').isString(),
    check('lastName').isString(),
    check('email').isEmail(),
    check('role').isString(),
    check('password').isString(),
    check('subdivisionId').optional().isInt(),
  ],
  validate,
  UserController.createUser
)


router.get('/all',
  authorize(constants.ROLES.ADMINISTRATOR),
  UserController.fetchAll
)

// -----------------------------------------------

router.get('/setup',
  requiresAnon,
  [
    query('magic').optional().isString().isLength({ min: 1 }),
  ],
  validate,
  UserController.getSetup
)


router.post('/setup',
  requiresAnon,
  [
    body('firstName').isString(),
    body('lastName').isString(),
    body('email').isEmail(),
    body('password').isString(),
    body('magic').isString(),
  ],
  validate,
  UserController.postSetup
)

// -----------------------------------------------

router.use('/posts/', userPostsRouter)

// -----------------------------------------------

router.post('/avatar',
  authorize(constants.ROLES.ALL),
  uploader.single('picture'),
  UserController.uploadAvatar
)

router.put('/password/update',
  authorize(constants.ROLES.ALL),
  [
    body('oldPassword').isString().isLength({ min: 6 }),
    body('newPassword').isString().isLength({ min: 6 }),
  ],
  validate,
  UserController.updatePassword
)

router.get('/:id',
  [
    check('id').isInt().withMessage(msg.validationError.integer),
  ],
  validate,
  UserController.fetchOne
)

router.put('/:id',
  authorize(constants.ROLES.ADMINISTRATOR),
  [
    param('id').isInt().withMessage(msg.validationError.integer),
    body('firstName').isString().optional(),
    body('lastName').isString().optional(),
    body('email').isEmail().optional(),
    body('role').isString().optional(),
  ],
  validate,
  UserController.updateUser
)

router.put('/:id/enable',
  authorize(constants.ROLES.ADMINISTRATOR),
  [
    param('id').isInt().withMessage(msg.validationError.integer),
  ],
  validate,
  UserController.enableUser
)

router.put('/:id/disable',
  authorize(constants.ROLES.ADMINISTRATOR),
  [
    param('id').isInt().withMessage(msg.validationError.integer),
  ],
  validate,
  UserController.disableUser
)

module.exports = router;
