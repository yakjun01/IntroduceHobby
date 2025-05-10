var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('home', { title: "Welcome to Jun U's Photo Diary" });
});

module.exports = router;