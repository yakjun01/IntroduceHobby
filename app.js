var createError = require('http-errors');
var express = require('express');
var mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1/blogdb';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var homeRouter = require('./routes/home');
var catalogRouter = require('./routes/catalog');
var flowerRouter = require('./routes/flower');
var sunsetRouter = require('./routes/sunset');
var moonRouter = require('./routes/moon');
var friendsRouter = require('./routes/friends');
var animalRouter = require('./routes/animal');
var cameraRouter = require('./routes/camera');
var nightviewRouter = require('./routes/nightview');
var oceanviewRouter = require('./routes/oceanview');
var etcRouter = require('./routes/etc');
var exampleRouter = require('./routes/example');
var cafeteriaRouter = require('./routes/cafeteria');
var beeRouter = require('./routes/bee');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/home', homeRouter);
app.use('/catalog', catalogRouter);
app.use('/flower', flowerRouter);
app.use('/moon', moonRouter);
app.use('/sunset', sunsetRouter);
app.use('/friends', friendsRouter);
app.use('/animal', animalRouter);
app.use('/camera', cameraRouter);
app.use('/nightview', nightviewRouter);
app.use('/oceanview', oceanviewRouter);
app.use('/etc', etcRouter);
app.use('/example', exampleRouter);
app.use('/cafeteria', cafeteriaRouter);
app.use('/bee', beeRouter);


app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {
  
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
