'use strict';

var mysql = require('mysql')
  , map = require('lodash.map')
  , log = require('fh-bunyan').getLogger(require('../package.json').name);

/**
 * Factory function that returns adapter instances.
 * @param  {Object} opts
 * @return {Object}
 */
module.exports = function (opts) {

  log.info('creating adapter for table "%s"', opts.table);

  /**
   * opts should be an Object containing:
   * - dbOpts - These are the options to pass to "mysql" module
   * - table  - The table the "mysql" instance should operate
   * - pk     - The primary key field for items in the table
   */

  // TODO: Maybe use connection pool?
  var connection = mysql.createConnection(opts.dbOpts);

  var adapter = {};


  /**
   * [create description]
   * @param  {[type]}   data     [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  adapter.create = function create (data, callback) {
    connection.query('INSERT TODO', function onCreate (err, rows) {
      if (err) {
        callback(err, null);
      } else {
        callback(
          null,
          // See: http://docs.feedhenry.com/v3/api/api_sync.html#api_sync-node_js_api-_fh_sync_globalhandlecreate
          map(rows, function createMap (row) {
            // Save the id for mapping to sync format
            var uid = row[opts.pk];

            // Remove ID from payload
            delete row[opts.pk];

            // Return valid sync data format
            return {
              uid: uid,
              data: row
            };
          })
        );
      }
    });
  };

  /**
   * [read description]
   * @param  {[type]}   id       [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  adapter.read = function read (id, callback) {};

  /**
   * [update description]
   * @param  {[type]}   id       [description]
   * @param  {[type]}   data     [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  adapter.update = function update (id, data, callback) {};

  /**
   * [delete description]
   * @param  {[type]}   id       [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  adapter.delete = function delete (id, callback) {};

  /**
   * [list description]
   * @param  {[type]}   query    [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  adapter.list = function list (query, callback) {};

  return adapter;
};
