function registerErrorHandler(app) {
    app.use(function(err, req, res, next) {
        console.error('An error occured: ' + err.stack);

        res.status(500).json(err);
    });
}

module.exports = {
    registerErrorHandler: registerErrorHandler
}