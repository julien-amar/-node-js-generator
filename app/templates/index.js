const http = require('http')
const socketIo = require('socket.io')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const colors = require('colors');

const config = require('./lib/config')

const authenticatedUserMiddleware = require('./lib/middlewares/authenticated-user')
const errorHandlerMiddleware = require('./lib/middlewares/error-handler')
const swaggerMiddleware = require('./lib/middlewares/swagger')
const chatMiddleware = require('./lib/middlewares/chat')

const databaseService = require('./lib/services/database')

var host = config.server.host || process.env.ECOM_HOST
var port = config.server.port || process.env.ECOM_PORT

var connectionString = config.mongo.connection_string

databaseService.connect(connectionString)

var app = express();
var server = http.Server(app);
var io = socketIo(server);

// set the view engine to ejs
app.set('view engine', 'ejs')
app.set('views', './lib/views')

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// this will handle all errors in pipeline
errorHandlerMiddleware.registerErrorHandler(app)

// all of our routes will be prefixed with /api
app.use('/api', authenticatedUserMiddleware, require('./lib/routes/categories'), require('./lib/routes/products'))

// swagger
swaggerMiddleware.registerSwagger(app, {
  title: 'Product API',
  version: '1.0.0',
  description: 'Interact with Category & Product entities through a RESTful API',
  host: host,
  port: port
})

// render static resources
app.use('/vendors', express.static('./public/vendors'))

app.use('/', require('./lib/routes/authentication'))
app.use('/', authenticatedUserMiddleware, express.static('./public'))

// register chat middleware
chatMiddleware.registerChat(io)

// start listening
server.listen(port, function () {
    console.log('Listening on ' + `${port}`.underline.cyan)
});
