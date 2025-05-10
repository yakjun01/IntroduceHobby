const { body,validationResult } = require('express-validator');

var Blog = require('../models/blog');

var async = require('async');

exports.index = function(req, res) {

    async.parallel({
        blog_count: function(callback) {
            Blog.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'Local Library Home', error: err, data: results });
    });
};

exports.blog_list = function(req, res, next) {

    Blog.find()
    .sort([['title', 'ascending']])
    .exec(function (err, list_blogs) {
      if (err) { return next(err); }

      res.render('blog_list', { title: 'blog List', blog_list: list_blogs });
    });
  
  };

exports.blog_detail = function(req, res, next) {

    async.parallel({
        blog: function(callback) {

            Blog.findById(req.params.id)
            
              .populate('blog')
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.blog==null) {
            var err = new Error('Blog not found');
            err.status = 404;
            return next(err);
        }
        res.render('blog_detail', { takeDate: results.blog.takeDate, blog: results.blog} );
    });

};

exports.blog_create_get = function(req, res, next) {
    res.render('blog_form', { title: '#Create Tips'});
};

exports.blog_create_post = [
    
    body('takeDate', 'TakeDate must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('f', 'F must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('shutterSpeed', 'ShutterSpeed must not be empty').trim().isLength({ min: 1 }).escape(),
    body('ISO.*').escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        var blog = new Blog(
          { takeDate: req.body.takeDate,
            title: req.body.title,
            f: req.body.f,
            shutterSpeed: req.body.shutterSpeed,
            ISO: req.body.ISO
           });

        if (!errors.isEmpty()) {
            
            res.render('blog_form', { title: 'Create New Tips', blog:req.body, errors: errors.array() });
            return;
        }
        else {
            blog.save(function (err) {
                if (err) { return next(err); }
                   res.redirect(blog.url);
                });
        }
    }
];

exports.blog_delete_get = function(req, res, next) {

    async.parallel({
        blog: function(callback) {
            Blog.findById(req.params.id).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.blog==null) {
            res.redirect('/catalog/blogs');
        }

        res.render('blog_delete', { title: 'Delete Post', blog: results.blog} );
    });

};

exports.blog_delete_post = function(req, res, next) {

    async.parallel({
        blog: function(callback) {
          Blog.findById(req.body.blogid).exec(callback)
        }
    }, function(err, results) {
        if (err) { return next(err); }
        else {

            Blog.findByIdAndRemove(req.body.blogid, function deleteBlog(err) {
                if (err) { return next(err); }
                res.redirect('/catalog/blogs')
            })
        }
    });
};


exports.blog_update_get = function(req, res, next) {

    async.parallel({
        blog: function(callback) {
            Blog.findById(req.params.id).populate('blog').exec(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.blog==null) {
                var err = new Error('Tips not found');
                err.status = 404;
                return next(err);
            }
            for (var all_g_iter = 0; all_g_iter < results.ISOs; all_g_iter++) {
                for (var blog_g_iter = 0; blog_g_iter < results.blog.ISO; blog_g_iter++) {
                    if (results.ISOs[all_g_iter]._id.toString()===results.blog.ISO[blog_g_iter]._id.toString()) {
                        results.ISOs[all_g_iter].checked='true';
                    }
                }
            }
            res.render('blog_form', { title: '#Update Tips', titles: results.titles, ISOs: results.ISOs, blog: results.blog });
        });

};


exports.blog_update_post = [

    /*(req, res, next) => {
        if(!(req.blog.ISO instanceof Array)){
            if(typeof req.body.ISO==='undefined')
            req.body.ISO=[];
            else
            req.body.ISO=new Array(req.body.ISO);
        }
        next();
    },*/

    body('takeDate', 'TakeDate must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('f', 'F must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('shutterSpeed', 'ShutterSpeed must not be empty').trim().isLength({ min: 1 }).escape(),
    body('ISO.*').escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        var blog = new Blog(
          { takeDate: req.body.takeDate,
            title: req.body.title,
            f: req.body.f,
            shutterSpeed: req.body.shutterSpeed,
            ISO: (typeof req.body.ISO==='undefined') ? [] : req.body.ISO,
            _id:req.params.id
           });

        if (!errors.isEmpty()) {
            
            async.parallel({
                titles: function(callback) {
                    Title.find(callback);
                },
                ISOs: function(callback) {
                    ISO.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                for (let i = 0; i < results.ISOs.length; i++) {
                    if (blog.ISO.indexOf(results.ISOs[i]._id) > -1) {
                        results.ISOs[i].checked='true';
                    }
                }
                res.render('blog_form', { title: '#Update Tips',titles: results.titles, ISOs: results.ISOs, blog: blog, errors: errors.array() });
            });
            return;
        }
        else {

            Blog.findByIdAndUpdate(req.params.id, blog, {}, function (err,theblog) {
                if (err) { return next(err); }
                   res.redirect(theblog.url);
                });
        }
    }
];