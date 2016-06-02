fh-rest-mysql-adapter
=====================

An adapter that facilitates exposing a RESTful API that talks to a particular
MySQL database table.

You can also create a custom solution by providing your own SQL statements if
desired.

## Install

Add the following in package.json.

```
"fh-rest-mysql-adapter": "git+https://github.com/feedhenry-staff/fh-rest-mysql-adapter"
```


## Usage

### Red Hat Mobile MBaaS Service (Basic)

Copy and paste this into an _application.js_, but change the _dbOpts_ as
necessary.

```js
'use strict';

/**
 * filename: application.js
 * The entry point of our RHAMP MBaaS Service
 */

var express = require('express')
  , mbaasApi = require('fh-mbaas-api')
  , mbaasExpress = mbaasApi.mbaasExpress()
  , app = module.exports = express()
  , log = require('fh-bunyan').getLogger(__filename);

log.info('starting application');

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys([]));
app.use('/mbaas', mbaasExpress.mbaas);

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

// Module used to create RESTful router instances
var fhRestExpressRouter = require('fh-rest-express-router');

// Module that RESTful router will use to retrieve data
// Note: this is not yet developed
var fhRestMySqlAdapter = require('fh-rest-mysql-adapter');

// Creates a handler for incoming HTTP requests that want to perform CRUDL
// operations on the "users" table in our MySQL database
var usersRouter = fhRestExpressRouter('users', fhRestMySqlAdapter({
  table: 'mobile_users',
  // Any options for https://github.com/sidorares/node-mysql2 are valid inside dbOpts
  dbOpts: {
    user: 'root',
    // port: 9001 // optional port number
    password:'password',
    host: '127.0.0.1',
    database: 'mobile'
  }
}))

// Expose a RESTful API to orders data, e.g:
// GET /users/5342
app.use(usersRouter);

// Important that this is last!
app.use(mbaasExpress.errorHandler());

var port = process.env.FH_PORT || process.env.VCAP_APP_PORT || 8001;
app.listen(port, function() {
  log.info('app started on port: %s', port);
});
```

### Calling the API
If you setup a service as shown above can then call this API like so using
cURL or similar HTTP client:

```bash
# Create a user
curl -X POST -H "content-type: application/json" --data '{"firstname":"ev", "lastname":"shortiss"}' http://your-app.feedhenry.com/users/

# List users
curl http://your-app.feedhenry.com/users/

# Read user that has id of "1"
curl http://your-app.feedhenry.com/users/1

# Update user that has id of  "1"
curl -X PUT -H "content-type: application/json" --data '{"firstname":"evan", "lastname":"shortiss"}' http://your-app.feedhenry.com/users/1

# Delete user that has id of "1"
curl -X "DELETE" http://your-app.feedhenry.com/users/1
```

### Direct API

Uses the standard _fh-rest_ interface. For examples take a look at [fh-rest-memory-adapter API](https://github.com/feedhenry-staff/fh-rest-memory-adapter#direct-api).

## SQL Statements

### Default Statements
By default this module will auto generate statements that target the table
provided in the options passed to it. Those statements are as follows:

#### Create

*INSERT into {opts.table} SET keyN=:valueN, keyN+1=:valueN+1*

Where _key_ and _value_ are generated for each key value pair in the POST data
sent to the API, or from _params.data_ in the Direct API.

For example, if this Object is posted to /users:

```js
{
  firstname: 'red',
  lastname: 'hat'
}
```

The INSERT statement will be _*INSERT into users SET firstname=red, lastname=hat*_

#### Read

_SELECT * FROM {opts.table} WHERE id=:id;_

Where _id_ comes from _params.id_ in the Direct API, or from the route params
in the HTTP API.

#### Update

_UPDATE {opts.table} SET keyN=:valueN, keyN+1=:valueN+1 WHERE id=:id;_

Similar to the create statement, but _id_ is also included in the params.

#### Delete

_DELETE FROM {opts.table} WHERE id=:id;_

Uses _params.id_ to perform a delete.

#### List

_SELECT * FROM {opts.table} WHERE keyN=:valueN, keyN+1=:valueN+1_

Uses _params.query_, or the querystring from a HTTP call, to generate the
SELECT statement.

### Using Custom SQL Statements (Advanced and Untested)

If you'd like to use custom SQL statements rather than the defaults that is
also possible. Simply provide them in the options passed to the adapter. All
statements support named placeholders.

Example:

```js
var customAdapter = fhRestMySqlAdapter({
  dbOpts: {
    user: 'root',
    password:'password',
    host: '127.0.0.1',
    database: 'mobile'
  },

  // Add functions to generate custom statements
  stmt: {
    create: function genCreateStatement (params) {
      // Add custom logic to generate an insert statement, or simply return one.
      // You could get fancy and use joins, stored procedures etc.

      // Named placeholders are used here, so params.data.firstname would be
      // injected in place of ":firstname" in the query
      return 'INSERT into test_table SET INSERT firstname=:firstname, lastname=:lastname;';
    },


    read: function genReadStatement (params) {
      // Use params.id to perform a read on the database
      return 'some sql string;';
    },


    update: function genUpdateStatement (params) {
      // Use params to perform an update, params will contain "id" and all
      // other keys at the root level, e.g
      // {
      //   id: '1',
      //   firstname: 'red',
      //   lastname: 'hat'
      // }
      return 'some sql string;';
    },


    delete: function genDeleteStatement (params) {
      // Use params.id to generate a delete statement
      return 'some sql string;';
    },


    list: function genListStatement (params) {
      // Use the params.query Object to build a query
      return 'some sql string;';
    },
  }
})
```

## Runing an Example Server
To run the example you must have the following installed:

* node.js (0.10.30 tested)
* npm (should be installed alongside node.js)
* MySQL (5.7.12 tested)

Here's how to get started:

```bash
# Go to some folder of your choosing
cd ~/workspaces

# Clone this code locally
git clone https://github.com/feedhenry-staff/fh-rest-mysql-adapter

# Navigate into the cloned folder
cd fh-rest-mysql-adapter

# Install dependencies, be patient :)
npm install

# Setup a database and a table in that database
mysql -u $MY_SQL_USER -p < ./example/create-table.sql

# Start the example server
npm run example
```

If all went well you should see something like this:

```
eshortis@eshortis-OSX:~/workspaces/fh/fh-sync-mysql-adapter$ npm run example

> fh-sync-mysql-adapter@0.1.0 example /Users/eshortis/workspaces/fh/fh-sync-mysql-adapter
> node example/server.js | bunyan

[2016-06-01T23:49:51.866Z] DEBUG: fh-sync-mysql-adapter/54858 on eshortis-OSX: connect to database using opts: {"user":"root","password":"password","host":"127.0.0.1","database":"mobile","namedPlaceholders":true}
[2016-06-01T23:49:51.867Z]  INFO: fh-sync-mysql-adapter/54858 on eshortis-OSX: creating adapter for table "mobile_users"
[2016-06-01T23:49:51.872Z]  INFO: fh-rest-express-router - users/54858 on eshortis-OSX: creating router for dataset "users"
[2016-06-01T23:49:51.891Z]  INFO: mysql adapter example/54858 on eshortis-OSX: fh-rest-mysql-adapter example listening on 8001
```

Finally, let's use our API! Try this to create a user:

```bash
curl -X POST -H "content-type: application/json" --data '{"firstname":"jane", "lastname":"doe"}' http://127.0.0.1:8001/users/
```

If it worked you should get a response that contains JSON data for the new user
we just created. Well done! There are more sample requests provided in
_Calling the API_ above.

## TODOs

* Security review
* Test cases
* Testing of custom statements
