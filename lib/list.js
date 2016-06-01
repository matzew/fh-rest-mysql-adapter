'use strict';

var VError = require('verror')
  , log = require('./log');

module.exports = function genListFn (opts) {
  return function mySqlList (connection, params, callback) {
    if (!params.query ||
        params.query && Object.keys(params.query).length === 0) {
      // If no query or query params are given then return all rows...
      // TODO: we should possibly return an error instead
      params.query = {
        '1': '1'
      };
    }

    var sql = opts.stmt.list(params);

    log.debug('perform list with sql, "%s"', sql);

    connection.execute(
      sql,
      params.query,
      function onMySqlList (err, rows) {
        if (err) {
          callback(new VError(err, 'error performing "list" query'), null);
        } else {
          var ret = {};

          rows.forEach(function onRow (r) {
            ret[r[opts.pk || 'id']] = r;
          });

          callback(null, ret);
        }
      }
    );
  };
};
