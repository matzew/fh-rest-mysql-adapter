'use strict';

var VError = require('verror')
  , xtend = require('xtend')
  , log = require('./log');

module.exports = function genUpdateFn (opts) {
  return function mySqlUpdate (connection, params, callback) {
    var sql = opts.stmt.update(params);

    log.debug('perform update with sql, "%s"', sql);

    connection.execute(
      // e.g "UPDATE table_name SET name=:name where id=:id;"
      sql,
      // Create composite object with id and other fields to build the
      // statement with less effort
      xtend({id: params.id}, params.data),
      function onMySqlUpdate (err, rows) {
        // TODO: Get updated row in db?
        if (err) {
          callback(new VError(err, 'error executing "update" query'), null);
        } else if (rows[0]) {
          callback(null, rows[0]);
        } else {
          callback(null, null);
        }
      }
    );
  };
};
