const express = require('express');
const userRoutes = require('./users');

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// mount user routes at /users
router.use('/users', userRoutes);

module.exports = router;
