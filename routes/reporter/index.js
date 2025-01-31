
const express = require('express');
const blogRoutes = require('./blog');

const router = express.Router({mergeParams: true});

// -----------------------------------------------
// BASE     /reporter
// -----------------------------------------------
// ROUTER   /projects/blog
// -----------------------------------------------


router.use('/blog', blogRoutes)

module.exports = router;