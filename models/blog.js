var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var blogSchema = new Schema(
  {
    takeDate: {type: String, required: true, maxLength: 100},
    title: {type: String, required: true, maxLength: 100},
    f: {type: String, required: true, maxLength: 100},
    shutterSpeed: {type: String, required: true, maxLength: 100},
    ISO: {type: String, required: true, maxLength: 100}
  }
);

blogSchema
.virtual('url')
.get(function () {
  return '/catalog/blog/' + this._id;
});

module.exports = mongoose.model('blog', blogSchema);