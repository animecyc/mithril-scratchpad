var vows = require('vows');
var assert = require('assert');
var InternalRoute = require('../core/server/router').InternalRoute;

vows.describe('Route').addBatch({
  properties: {
    topic: new InternalRoute('GET', '/foo/bar', 'bar@index'),
    'it outputs correct properties': function(route) {
      assert.deepEqual({
        method: 'GET',
        path: '/foo/bar',
        resource: 'bar@index',
        config: {}
      }, route);
    }
  }
}).export(module);
