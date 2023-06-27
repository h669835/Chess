'use admin';

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var failedConnections = 0;
let autoReconnect = true;

let uri = `mongodb+srv://chess:${process.env.DB_PASS}@chess-cluster-0.sulrvea.mongodb.net/?retryWrites=true&w=majority`;

mongoose
    .connect(uri,{useUnifiedTopology: true, useNewUrlParser: true})
    .then(() => console.log("DB connected!"));


/** Mongoose is disconnected--> Tries to reconnect three times, then gives up **/
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose is disconnected.');
    if(failedConnections < 3 && autoReconnect) {
        console.log('Trying to reconnect.. ');
        mongoose.connect(uri,{useUnifiedTopology: true, useNewUrlParser: true});
        failedConnections++;
    }
});

/** Mongoose error **/
mongoose.connection.on('error', function(err) {
    console.log('Mongoose encountered an error: ' + err);
});

/** Application closing **/
process.on('SIGINT', function () {
    console.log('Goodbye from mongoose! :)');
    process.exit(0);
});

/** Handles SIGUSR2 when nodemon restart **/
process.once('SIGUSR2', function() {
    console.log('Restarting mongoose.');
    process.kill(process.pid, 'SIGUSR2');

});


/** Handles SIGUTERM after Heroku restar **/
process.on('SIGTERM', function() {
    console.log('Goodbye from Heroku! :)');
    process.exit(0);

});
