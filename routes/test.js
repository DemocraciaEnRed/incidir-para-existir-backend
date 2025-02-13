
const express = require('express');
const models = require('../models');
const mailer = require('../services/mailer');
const router = express.Router();
const { faker } = require('@faker-js/faker');
const uploader = require('../middlewares/s3');
const { query, check } = require('express-validator');
const validate = require('../middlewares/validate');
const TestController = require('../controllers/testController');

// ids is a string of comma separated integers
router.get('/dimensions-query', 
  [
    query('id.*').isInt().withMessage('id must be an array of integers'),
  ],
  validate,
  TestController.dimensionsQuery
)

router.get('/verify-account', TestController.verifyAccount)

router.get('/create-initiatives', TestController.createInitiatives)

router.get('/create-challenges', TestController.createChallenges)

router.get('/create-blog-entries', TestController.createBlogEntries)

router.get('/create-bot-responses', TestController.createBotResponses)

router.get('/create-resources', TestController.createResorces)

router.post('/file-test', 
  uploader.single('file'),
  TestController.fileTest
)

module.exports = router;
