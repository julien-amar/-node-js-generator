const router = require('express').Router()

const db = require('../models/category')

/**
 * @swagger
 * definition:
 *   Category:
 *     properties:
 *       name:
 *         type: string
 *       createdAt:
 *         type: string
 *         format: date-time
 *       updatedAt:
 *         type: string
 *         format: date-time
 */

router
    /**
     * @swagger
     * /api/categories/{id}:
     *   put:
     *     tags:
     *       - Categories
     *     description: Updates a single category
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Category's id
     *         in: path
     *         required: true
     *         type: integer
     *       - name: category
     *         description: Category object
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/Category'
     *     responses:
     *       200:
     *         description: Category object
     *         schema:
     *           $ref: '#/definitions/Category'
     */
    .put('/categories/:id', function (req, res, next) {
        var category = req.body

        category.updatedAt = new Date()
        
        db.findByIdAndUpdate(req.params.id, category, function (err, category) {
            if(err) {
                next(err)
            } else {
                res.json(category)
            }
        })
    })

    /**
     * @swagger
     * /api/categories:
     *   post:
     *     tags:
     *       - Categories
     *     description: Creates a new category
     *     parameters:
     *       - name: category
     *         description: Category object
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/Category'
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Category object
     *         schema:
     *           $ref: '#/definitions/Category'
     */
    .post('/categories', function (req, res, next) {
        var category = req.body

        db.create(category, function (err, category) {
            if(err) {
                next(err);
            } else {
                res.json(category)
            }
        })
    })

    /**
     * @swagger
     * /api/categories/{id}:
     *   get:
     *     tags:
     *       - Categories
     *     description: Returns a single category
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Category's id
     *         in: path
     *         required: true
     *         type: integer
     *     responses:
     *       200:
     *         description: Category object
     *         schema:
     *           $ref: '#/definitions/Category'
     */
    .get('/categories/:id', function (req, res, next) {
        db.findById(req.params.id, function (err, category) {
            if(err) {
                next(err)
            } else {
                res.json(category)
            }
        })
    })

    /**
     * @swagger
     * /api/categories:
     *   get:
     *     tags:
     *       - Categories
     *     description: Returns all categories
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: An array of category
     *         schema:
     *           $ref: '#/definitions/Category'
     */
    .get('/categories', function (req, res, next) {
        db.find(function (err, categories) {
            if(err) {
                next(err);
            } else {
                res.json({count: categories.length, elements: categories});
            }
        });
    })

    /**
     * @swagger
     * /api/categories/{id}:
     *   delete:
     *     tags:
     *       - Categories
     *     description: Deletes a single category
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Category's id
     *         in: path
     *         required: true
     *         type: integer
     *     responses:
     *       200:
     *         description: Successfully deleted
     */
    .delete('/categories/:id', function (req, res, next) {
        db.findByIdAndRemove(req.params.id, function (err) {
            if(err) {
                next(err)
            } else {
                res.json({})
            }
        })
    })

module.exports = router;