'use strict';

var test = require('ava')
  , sinon = require('sinon')
  , proxyquire = require('proxyquire');

var stubs = {
  './connection': sinon.spy(function () {
    return sinon.stub();
  }),
  './statements': sinon.spy(function () {
    return {
      genInsertStmt: sinon.stub(),
      genReadStmt: sinon.stub(),
      genUpdateStmt: sinon.stub(),
      genDeleteStmt: sinon.stub(),
      genListStmt: sinon.stub()
    };
  }),
  './log': {
    info: sinon.stub(),
    debug: sinon.stub()
  }
};

var dbOpts = {
  host: 'localhost',
  user: 'mobile',
  password: 'password'
};

var table = 'user';

var adapter = proxyquire('lib/adapter', stubs);

test('should create an adapter', function (t) {
  var a = adapter({
    table: table,
    dbOpts: dbOpts
  });

  t.is(typeof a, 'object');
  t.is(stubs['./connection'].calledOnce, true);
  t.is(stubs['./statements'].calledOnce, true);
});

test('should create an adapter', function () {});

test('should create an adapter', function () {});

test('adapter.create should be defined', function () {});

test('adapter.read', function () {});

test('adapter.update', function () {});

test('adapter.delete', function () {});

test('adapter.list', function () {});
