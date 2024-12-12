const express = require('express');
const { check } = require('express-validator');

const validate = require('../middlewares/validate');
const authorize = require('../middlewares/authorize');
const requiresAnon = require('../middlewares/requiresAnon');
const AuthController = require('../controllers/authController');
const msg = require('../utils/messages');

// initialize router
const router = express.Router();

// -----------------------------------------------
// BASE     /auth
// -----------------------------------------------
// POST 	/auth/register
// POST 	/auth/login
// POST 	/auth/refresh-token
// GET 		/auth/verify/:token
// POST 	/auth/resend
// POST 	/auth/forgot
// POST 	/auth/reset/:token
// GET 		/auth/logged-in
// -----------------------------------------------


router.post('/register', 
	requiresAnon,
	[
    check('email').isEmail().withMessage(msg.validationError.email),
		check('firstName').not().isEmpty().withMessage(msg.validationError.invalidValue),
		check('lastName').not().isEmpty().withMessage(msg.validationError.invalidValue),
		check('subdivisionId').optional().isNumeric().withMessage(msg.validationError.invalidValue),
		check('password').not().isEmpty().isLength({ min: 6 }).withMessage(msg.validationError.invalidValue),
	], 
	validate,
	AuthController.register
);

router.post("/login",
	requiresAnon,
	[
		check('email').isEmail().withMessage(msg.validationError.email),
		check('password').not().isEmpty().isLength({ min: 6 }).withMessage(msg.validationError.invalidValues),
	],
	validate,
	AuthController.login
);

router.post('/refresh-token',
	authorize(),
	AuthController.refreshToken
);

router.get('/verify/:token',
	[
		check('token').not().isEmpty().withMessage(msg.validationError.token),
	],
	validate,
	AuthController.verify
);

router.post('/resend', 
	requiresAnon,
	[
		check('email').isEmail().withMessage(msg.validationError.email),
	],
	validate,
	AuthController.resendToken
);

router.post('/forgot', 
	requiresAnon,
	[
		check('email').isEmail().withMessage(msg.validationError.email),
	],
	validate,
	AuthController.forgot
);


router.post('/reset/:token',
	requiresAnon,
	[
		check('password').not().isEmpty().isLength({ min: 6 }).withMessage(msg.validationError.password),
		check('confirmPassword', 'Las contraseñas no son similares').custom((value, { req }) => (value === req.body.password)),
	],
	validate,
	AuthController.resetPassword
);

router.get('/session',
	
	AuthController.getSession
);

router.post('/logout',
	AuthController.logout
);

router.get('/logged',
	AuthController.loggedIn
);

module.exports = router;