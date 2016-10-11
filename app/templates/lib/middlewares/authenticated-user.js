const jwt = require('jsonwebtoken')

const config = require('../config')
const dbUser = require('../models/user')

module.exports = function(req, res, next) {
  jwt.verify(req.cookies[config.crypto.jwt.cookie], config.crypto.jwt.secret, function(err, user) {
        if (err) {
            return res.redirect('/login')
        }

        dbUser.findOne({ username: user.username }, function (err, user) {
            if (!user) {
                return res.redirect('/login')
            }

            return next()
        })
    })
}