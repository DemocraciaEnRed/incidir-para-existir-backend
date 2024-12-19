const express = require('express');
const { check, query } = require('express-validator');

const validate = require('../middlewares/validate');
const authorize = require('../middlewares/authorize');
const FaqController = require('../controllers/faqController');

// initialize router
const router = express.Router();

// -----------------------------------------------
// BASE   /faq
// -----------------------------------------------
// GET 	  /faq
// GET 	  /faq/:id
// POST 	/faq
// PUT 	  /faq/:id
// DELETE  /faq/:id
// -----------------------------------------------

// initialize router

router.get('', 
  FaqController.getAll
);

router.get('/:id',
  FaqController.getOne
);

router.post('',
  authorize('admin'),
  [
    check('order').isInt().withMessage('Order is required'),
    check('question').not().isEmpty().withMessage('Question is required'),
    check('answer').not().isEmpty().withMessage('Answer is required'),
  ],
  validate,
  FaqController.create
);

router.put('/:id',
  authorize('admin'),
  [
    check('order').isInt().withMessage('Order is required'),
    check('question').not().isEmpty().withMessage('Question is required'),
    check('answer').not().isEmpty().withMessage('Answer is required'),
  ],
  validate,
  FaqController.edit
);

router.delete('/:id',
  authorize('admin'),
  FaqController.delete
);

module.exports = router;
