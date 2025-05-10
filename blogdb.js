console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

var userArgs = process.argv.slice(2);

var async = require('async')
var Blog = require('./models/blog')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var blogs = []

function blogCreate(takeDate, f, shutterSpeed, title, ISO, cb) {
  blogdetail = { 
    takeDate: takeDate,
    f: f,
    title: title,
    shutterSpeed: shutterSpeed,
    ISO: ISO
  }
    
  var blog = new Blog(blogdetail);    
  blog.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Blog: ' + blog);
    blogs.push(blog)
    cb(null, blog)
  }  );
}

function createBlogs(cb) {
    async.parallel([
        function(callback) {
          blogCreate('takeDate', 'f', 'shutterSpeed', 'title', 'ISO', callback);
        }
        ],
        cb);
}
async.series([
    createBlogs,
],

function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Blogs: '+blogs);
        
    }

    mongoose.connection.close();
});