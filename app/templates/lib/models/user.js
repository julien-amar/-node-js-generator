const crypto = require('crypto')
const mongoose = require('mongoose')

const config = require('../config')

var hMac = function(password) {
  return crypto
    .createHmac('sha512', config.crypto.authentication.secret)
    .update(password)
    .digest('hex')
};

var accountSchema = mongoose.Schema({
  username: String,
  password: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

accountSchema.methods.encryptPassword = function() {
  this.password = hMac(this.password)

  return this
}

accountSchema.methods.isValid = function(password) {
  return this.password === hMac(password)
}

module.exports = mongoose.model('user', accountSchema)
