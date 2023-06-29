'use admin';

require('dotenv').config();
const expressJSDocSwagger = require('express-jsdoc-swagger');
var express = require('express');
var bodyParser = require('body-parser');
var dataBase = require('./api/models/db');
var routesApi = require('./api/routes/apiRoutes');
var app = express();
var player = require('./api/models/playerModel');
var status = require('./api/models/chessboardModel');
var port = process.env.PORT || 3000;

const logger = require("./logger");

const options = {
  info: {
    version: '1.0.0',
    title: 'Chess API',
    license: {
      name: 'MIT',
    },
  },
  filesPattern: './index.js',
  baseDir: __dirname,
  security: {
    BasicAuth: {
      type: 'http',
      scheme: 'basic',
    },
  },  
}

expressJSDocSwagger(app)(options);

 var server = app.listen(3000, function () {
     var host = server.address().address;
     host = (host === '::' ? 'localhost' : host);
     var port = server.address().port;
     logger.info(`Listening at http://${host}:${port}`)

 });




 /**
 * GET
 * @summary This is the summary of the endpoint
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
app.get('/', function (req, res) {
  res.send('<!DOCTYPE html><html><body style="background-color:gray;"><h1 style="text-align:center;">Up and running.</h1></body></html>');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routesApi(app);








/** Error handling **/

app.use(function(req, res) {
  res.status(404).send({error: 'Url not found!', url: req.originalUrl})

});
