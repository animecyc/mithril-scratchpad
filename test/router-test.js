var vows = require('vows');
var assert = require('assert');
var Router = require('../core/server/router');
var InternalRouter = Router.InternalRouter;
var InternalRoute = Router.InternalRoute;

vows.describe('Router').addBatch({
  build: {
    'it builds routes': function() {
      var routes = Router(function(route) {
        return [
          route.get('/', 'foo@bar')
        ];
      });

      assert(routes.length === 1);
      assert(routes[0] instanceof InternalRoute);
    },
    'it flattens dimensions': function() {
      var routes = Router(function(route) {
        return [
          [
            route.get('/', 'foo@bar')
          ]
        ];
      });

      assert(routes.length === 1);
      assert(routes[0] instanceof InternalRoute);
    }
  },
  get: {
    topic: new InternalRouter(),
    'it outputs get route': function(router) {
      assert.deepEqual({
        method: 'GET',
        path: '/',
        resource: 'foo@bar',
        config: {}
      }, router.get('/', 'foo@bar'));
    }
  },
  post: {
    topic: new InternalRouter(),
    'it outputs post route': function(router) {
      assert.deepEqual({
        method: 'POST',
        path: '/',
        resource: 'foo@bar',
        config: {}
      }, router.post('/', 'foo@bar'));
    }
  },
  put: {
    topic: new InternalRouter(),
    'it outputs put route': function(router) {
      assert.deepEqual({
        method: 'PUT',
        path: '/',
        resource: 'foo@bar',
        config: {}
      }, router.put('/', 'foo@bar'));
    }
  },
  delete: {
    topic: new InternalRouter(),
    'it outputs delete route': function(router) {
      assert.deepEqual({
        method: 'DELETE',
        path: '/',
        resource: 'foo@bar',
        config: {}
      }, router.delete('/', 'foo@bar'));
    }
  },
  resource: {
    topic: new InternalRouter(),
    'it outputs resource routes': function(router) {
      var resources = router.resource('foo', 'bar');

      assert(Array.isArray(resources));

      resources.forEach(function(route) {
        assert(route instanceof InternalRoute);
      });
    },
    'it outputs resource routes without index': function(router) {
      var indexTestRegExp = /\@index$/;
      var resources = router.resource('foo', 'bar', {
        except: ['index']
      });

      for (var i = 0; i < resources.length; i++) {
        assert(!indexTestRegExp.test(resources[i].resource));
      }
    },
    'it outputs resource routes with only index': function(router) {
      var indexTestRegExp = /\@index$/;
      var resources = router.resource('foo', 'bar', {
        only: ['index']
      });

      assert(resources.length === 1);
      assert(indexTestRegExp.test(resources[0].resource));
    }
  }
}).export(module);
