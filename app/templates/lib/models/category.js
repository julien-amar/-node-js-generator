var mongoose = require('mongoose');

var categorySchema = mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('category', categorySchema);