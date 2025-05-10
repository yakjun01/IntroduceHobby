var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('oceanview', { title: 'Ocean View' });
});

module.exports = router;
