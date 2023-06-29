'use admin';

const logger = require("../../logger");
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var failedConnections = 0;
let autoReconnect = true;

let uri = `mongodb+srv://chess:${process.env.DB_PASS}@chess-cluster-0.sulrvea.mongodb.net/?retryWrites=true&w=majority`;

mongoose
    .connect(uri,{useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true})
    .then(() => logger.info("MongoDB Connected!"));


/** Mongoose is disconnected--> Tries to reconnect three times, then gives up **/
mongoose.connection.on('disconnected', function() {
    logger.warn("MongoDB Disconnected!");
    if(failedConnections < 3 && autoReconnect) {
        logger.info("Trying to reconnect. . .");
        mongoose.connect(uri,{useUnifiedTopology: true, useNewUrlParser: true});
        failedConnections++;
    }
});

/** Mongoose error **/
mongoose.connection.on('error', function(err) {
    logger.error(`MongoDB encountered an error: ${err}`);
});

/** Application closing **/
process.on('SIGINT', function () {
    logger.info("Goodbye from MongoDB! :)")
    process.exit(0);
});

/** Handles SIGUSR2 when nodemon restart **/
process.once('SIGUSR2', function() {
    logger.info("Restarting. . .")
    process.kill(process.pid, 'SIGUSR2');

});


/** Handles SIGUTERM after Heroku restar **/
process.on('SIGTERM', function() {
    logger.info("Goodbye from Heroku :)")
    process.exit(0);

});
