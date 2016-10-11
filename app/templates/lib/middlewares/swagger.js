const swaggerJSDoc = require('swagger-jsdoc')

function registerSwagger(app, settings) {
    var swaggerDefinition = {
        info: {
            title: settings.title,
            version: settings.version,
            description: settings.description
        },
        host: `${settings.host}:${settings.port}`,
        basePath: settings.path || '/',
    }

    var options = {
        swaggerDefinition: swaggerDefinition,
        apis: [ './lib/routes/*.js' ]
    }

    // initialize swagger-jsdoc
    var swaggerSpec = swaggerJSDoc(options);

    app.get('/swagger.json', function(req, res) {
        res.setHeader('Content-Type', 'application/json');

        res.send(swaggerSpec);
    });
}

module.exports = {
    registerSwagger: registerSwagger
}
