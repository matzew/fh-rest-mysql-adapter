'use strict';

var VError = require('verror')
  , log = require('./log');

module.exports = function genReadFn (opts) {
  return function mySqlRead (connection, params, callback) {
    var sql = opts.stmt.read(params);

    log.debug('perform read with sql, "%s"', sql);

    connection.execute(
      // e.g "SELECT * FROM table_name WHERE id=:id"
      sql,
      {
        id: params.id
      },
      function onMysqlRead (err, rows) {
        if (err) {
          callback(new VError(err, 'error executing "read" query'), null);
        } else if (rows[0]) {
          callback(null, rows[0]);
        } else {
          callback(null, null);
        }
      }
    );
  };
};
