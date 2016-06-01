'use strict';

// Create an express http server that will host our API
var app = require('express')();

// Change this if you want to listen on a different port
var port = 8001;

// Our sweet bunyan based logger
var log = require('fh-bunyan').getLogger('mysql adapter example');

// This enables us to create RESTful route handlers
var fhRestRouter = require('fh-rest-express-router');

// MySQL adapater that can be used by instances of fh-rest-express-router
var fhRestMySqlAdapter = require('../lib/adapter');

// Our MySQL adapter for the "mobile_users" table
var usersMySqlAdapter = fhRestMySqlAdapter({
  table: 'mobile_users',
  dbOpts: {
    user: 'root',
    password:'password',
    host: '127.0.0.1',
    database: 'mobile'
  }
});

// Expose the "mobile_users" table as "/users"
app.use(fhRestRouter('users', usersMySqlAdapter));

// Start listening for http requests
app.listen(port, function (err) {
  if (err) {
    throw err;
  }

  log.info('fh-rest-mysql-adapter example listening on %s', port);
});
