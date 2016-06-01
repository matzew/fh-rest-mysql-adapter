'use strict';

var VError = require('verror')
  , xtend = require('xtend')
  , log = require('./log');

module.exports = function genDeleteFn (opts) {
  var read = require('./read')(opts);

  return function mySqlDelete (connection, params, callback) {

    function onDeleteRead (err, data) {
      if (err) {
        callback(new VError(err, 'pre-delete read failed'), null);
      } else if (!data) {
        // TODO: is this correct? Should we return a 500 instead?
        callback(null, null);
      } else {
        _mySqlDelete(data);
      }
    }

    function _mySqlDelete (oldData) {
      var sql = opts.stmt.delete(params);

      log.debug('perform delete with sql, "%s"', sql);

      connection.execute(
        // e.g "DELETE FROM users WHERE id=:id;""
        sql,
        // Create composite object with id and other fields to build the
        // statement with less effort
        xtend({id: params.id}, params.data),
        function onMySqlDelete (err) {
          if (err) {
            callback(new VError(err, 'error executing "delete" query'), null);
          } else {
            callback(null, oldData);
          }
        }
      );
    }

    read(connection, params, onDeleteRead);
  };
};
