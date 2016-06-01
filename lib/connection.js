'use strict';

var mysql = require('mysql2')
  , VError = require('verror')
  , log = require('./log');

module.exports = function getConnector (opts) {
  // Allow use of named placeholders:
  // https://github.com/sidorares/node-mysql2#named-placeholders
  opts.namedPlaceholders = true;

  var pool = mysql.createPool(opts);

  log.debug('connect to database using opts: %j', opts);

  return function wrapAdapterFn (fn) {

    return function execAdapterFn (params, callback) {
      pool.getConnection(function onMySqlConnection (err, conn) {
        if (err) {
          callback(new VError(err, 'failed to get mysql connection'), null);
        } else {
          fn(conn, params, callback);
        }
      });
    };

  };
};
