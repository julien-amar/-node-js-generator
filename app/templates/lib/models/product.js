var mongoose = require('mongoose');

var productSchema = mongoose.Schema({
  name: String,
  price: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('product', productSchema);