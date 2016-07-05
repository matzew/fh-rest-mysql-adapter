'use strict';

module.exports = function (table) {
  var stmt = {};

  /**
   * Generates a prepared statement style syntax from an object, e.g
   * Input:   {name: 'john', age: '55'}
   * Output:  ' name=:name, age=:age'
   * @param  {Object} data
   * @return {String}
   */
  function genPrepStmtFromObj (data) {
    var keys = Object.keys(data)
      , ret = ''
      , cur;

    for (var i = 0; i< keys.length; i++) {
      cur = keys[i].toString();
      
      // Create the variables for the statement, adding a comma if not the first
      ret += ((i === 0) ? ' ' : ', ') + cur.toString() + '=:' + cur.toString();
    }

    return ret;
  }

  /**
   * Generates an insert statement for the given table
   * @param  {Object} params
   * @return {String}
   */
  stmt.genInsertStmt = function genInsertStmt (params) {
    return 'INSERT into ' +
      table +
      ' SET' +
      genPrepStmtFromObj(params.data) + ';';
  };

  /**
   * Generates an update statement for the given table
   * @param  {Object} params
   * @return {String}
   */
  stmt.genUpdateStmt = function genUpdateStmt (params) {
    return 'UPDATE ' + table + ' SET ' + genPrepStmtFromObj(params.data) +
      ' WHERE id=:id;';
  };

  /**
   * Generates a select statement for the given table
   * @param  {Object} params
   * @return {String}
   */
  stmt.genListStmt = function genListStmt (params) {
    return 'SELECT * FROM ' +
      table +
      ' WHERE' +
      genPrepStmtFromObj(params.query) +
      ';';
  };

  /**
   * Generates a read statement for the given table
   * @param  {Object} params
   * @return {String}
   */
  stmt.genReadStmt = function genReadStmt (/* params */) {
    return 'SELECT * FROM ' + table + ' WHERE id=:id;';
  };

  /**
   * Generates a delete statement for the given table
   * @param  {Object} params
   * @return {String}
   */
  stmt.genDeleteStmt = function genDeleteStmt (/* params */) {
    return 'DELETE FROM ' + table + ' WHERE id=:id;';
  };

  return stmt;
};
