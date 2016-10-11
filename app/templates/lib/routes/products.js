const router = require('express').Router()

const db = require('../models/product')

/**
 * @swagger
 * definition:
 *   Product:
 *     properties:
 *       name:
 *         type: string
 *       price:
 *         type: integer
 *         format: int32
 *       category:
 *         schema:
 *           $ref: '#/definitions/Category'
 *       description:
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
     * /api/products/{id}:
     *   put:
     *     tags:
     *       - Products
     *     description: Updates a single product
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Product's id
     *         in: path
     *         required: true
     *         type: integer
     *       - name: product
     *         description: Product object
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/Product'
     *     responses:
     *       200:
     *         description: Product object
     *         schema:
     *           $ref: '#/definitions/Product'
     */
    .put('/products/:id', function (req, res, next) {
        var product = req.body

        product.updatedAt = new Date()

        db.findByIdAndUpdate(req.params.id, product, function (err, product) {
            if(err) {
                next(err)
            } else {
                res.json(product)
            }
        })
    })

    /**
     * @swagger
     * /api/products:
     *   post:
     *     tags:
     *       - Products
     *     description: Creates a new product
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: product
     *         description: Product object
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/Product'
     *     responses:
     *       200:
     *         description: Product object
     *         schema:
     *           $ref: '#/definitions/Product'
     */
    .post('/products', function (req, res, next) {
        var product = req.body;

        db.create(product, function (err, product) {
            if(err) {
                next(err)
            } else {
                res.json(product)
            }
        })
    })
    
    /**
     * @swagger
     * /api/products/{id}:
     *   get:
     *     tags:
     *       - Products
     *     description: Returns a single product
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Product's id
     *         in: path
     *         required: true
     *         type: integer
     *     responses:
     *       200:
     *         description: Product object
     *         schema:
     *           $ref: '#/definitions/Product'
     */
    .get('/products/:id', function (req, res, next) {
        db.findById(req.params.id).populate('category').exec(function (err, product) {
            if(err) {
                next(err)
            } else {
                res.json(product)
            }
        })
    })

    /**
     * @swagger
     * /api/products:
     *   get:
     *     tags:
     *       - Products
     *     description: Returns all products
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: An array of product
     *         schema:
     *           $ref: '#/definitions/Product'
     */
    .get('/products', function (req, res, next) {
        db.find().populate('category').exec(function (err, products) {
            if(err) {
                next(err)
            } else {
                res.json({count: products.length, elements: products})
            }
        })
    })

    /**
     * @swagger
     * /api/products/{id}:
     *   delete:
     *     tags:
     *       - Products
     *     description: Deletes a single product
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Product's id
     *         in: path
     *         required: true
     *         type: integer
     *     responses:
     *       200:
     *         description: Successfully deleted
     */
    .delete('/products/:id', function (req, res, next) {
        db.findByIdAndRemove(req.params.id, function (err) {
            if(err) {
                next(err)
            } else {
                res.json({})
            }
        })
    })

module.exports = router;