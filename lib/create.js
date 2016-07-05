'use strict';

var VError = require('verror')
  , log = require('./log');

module.exports = function genCreateFn (opts) {
  return function mySqlCreate (connection, params, callback) {
    var sql = opts.stmt.create(params);

    log.debug('perform create with sql, "%s"', sql);

    connection.execute(
      // e.g "INSERT into table_name SET name=:name, age=:age"
      sql,
      params.data,
      function onMySqlCreate (err, res) {
        if (err) {
          callback(new VError(err, 'error executing "create" query'), null);
        } else {
          callback(
            null,
            {
              data: params.data,
              uid: res.insertId
            }
          );
        }
    });
  };
};
