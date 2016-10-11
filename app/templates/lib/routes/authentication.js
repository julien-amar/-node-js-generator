const router = require('express').Router()
const jwt = require('jsonwebtoken')

const config = require('../config')
const dbUser = require('../models/user')

/**
 * @swagger
 * definition:
 *   User:
 *     properties:
 *       _id:
 *         type: string
 *       username:
 *         type: string
 */

router
    // Route : GET /login
    // Description: Authentication page
    .get('/login', function (req, res) {
        res.render('authentication/login', {
            message: ''
        })
    })

    // Route : POST /login
    // Description: Authentication page
    .post('/login', function (req, res, next) {
        const login = req.body.username
        const password = req.body.password

        dbUser.findOne({ username: login }, function (err, user) {
            if (err) {
                return next(err)
            }

            const errorMessage = `Authentication failed for login ${req.body.username}`

            if (!user) {
                return res.render('authentication/login', { message: errorMessage })
            }

            if (user.username !== login || !user.isValid(password)) {
                return res.render('authentication/login', { message: errorMessage })
            }

            jwt.sign(req.body, config.crypto.jwt.secret, { expiresIn: '10 minutes' }, function(err, token) {
                if (err) {
                    return res.render('authentication/login', { message: errorMessage })
                }

                res.cookie(config.crypto.jwt.cookie, token, { httpOnly: true, path: '/' })
                    .redirect('/')
            })
        })
    })

    // Route : GET /register
    // Description: Account registration page 
    .get('/register', function (req, res) {
        res.render('authentication/register')
    })

    // Route : POST /register
    // Description: Account registration page 
    .post('/register', function (req, res) {
        var user = new dbUser(req.body)
        
        user.encryptPassword()

        user.save(function(err, user) {
            if (err) {
                return next(err)
            }

            res.redirect('/login')
        })
    })

    .get('/logout', function(req, res) {
        res.clearCookie(config.crypto.jwt.cookie)

        res.redirect('/login')
    })

    /**
     * @swagger
     * /account:
     *   get:
     *     tags:
     *       - Users
     *     description: Retrieve authenticated user informations
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: User object
     *         schema:
     *           $ref: '#/definitions/User'
     */
    .get('/account', function(req, res, next) {
        jwt.verify(req.cookies[config.crypto.jwt.cookie], config.crypto.jwt.secret, function(err, user) {
            if (err) {
                return next(err)
            }

            dbUser.findOne({ username: user.username }, function (err, user) {
                if (!user) {
                    return res.status(404)
                }

                return res.json({
                    "_id": user._id,
                    "username": user.username 
                })
            })
        })
    })

module.exports = router