const mongoose = require('mongoose');

function connect(connectionString) {
    mongoose.connect(connectionString, function(err) {
        if(err) {
            console.error(err)

            process.exit()
        }
    });
}

module.exports = {
    connect: connect
}