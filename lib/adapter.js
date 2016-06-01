'use strict';

var connection = require('./connection')
  , statements = require('./statements')
  , log = require('./log');


/**
 * Factory function that returns adapter instances.
 * @param  {Object} opts
 * @return {Object}
 */
module.exports = function createMySqlAdapter (opts) {
  var stmt = statements(opts.table);
  var connector = connection(opts.dbOpts);

  log.info('creating adapter for table "%s"', opts.table);

  // Ensure we have sql statements configured, or use defaults
  opts.stmt = opts.stmt || {};
  opts.stmt.create  = opts.stmt.create || stmt.genInsertStmt;
  opts.stmt.read    = opts.stmt.read   || stmt.genReadStmt;
  opts.stmt.update  = opts.stmt.update || stmt.genUpdateStmt;
  opts.stmt.delete  = opts.stmt.delete || stmt.genDeleteStmt;
  opts.stmt.list    = opts.stmt.list   || stmt.genListStmt;

  /**
   * opts should be an Object containing:
   * - dbOpts - These are the options to pass to "mysql" module
   * - table  - The table the "mysql" instance should operate
   * - pk     - The primary key field for items in the table (TODO)
   */


  var adapter = {};


  /**
   * Create a row in the database with the given inputs
   * @param  {Object}   params
   * @param  {Function} callback
   */
  adapter.create = connector(require('./create')(opts));

  /**
   * Reads a row from the database
   * @param  {Object}   params
   * @param  {Function} callback
   */
  adapter.read = connector(require('./read')(opts));

  /**
   * Update a single row in the database
   * @param  {Object}   params     Contains update data and id to target
   * @param  {Function} callback
   */
  adapter.update = connector(require('./update')(opts));

  /**
   * Delete a row in the mysql database
   * @param  {Object}   params
   * @param  {Function} callback
   */
  adapter.delete = connector(require('./delete')(opts));

  /**
   * Performs a list operation
   * @param  {Object}   params   Contains the query data for this list call
   * @param  {Function} callback
   */
  adapter.list = connector(require('./list')(opts));


  return adapter;
};
