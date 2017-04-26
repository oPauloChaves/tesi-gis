const express = require('express');
const locationRoutes = require('./location');

const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// mount locations routes at /locations
router.use('/locations', locationRoutes);

module.exports = router;
