var _ = require('lodash');
var path = require('path');
var hapi = require('hapi');
var inert = require('inert');
var InternalRoute = require('./router').InternalRoute;

var server = new hapi.Server();

module.exports = function(config) {
  config = config || {};

  server.connection({
    port: config.port || 3000
  });

  if (!server.plugins.inert) {
    server.register(inert, _.noop);
  }

  if (Array.isArray(config.routes)) {
    config.routes.forEach(function(route) {
      if (route instanceof InternalRoute && !route.handler && !route.config.handler) {
        route.handler = function(req, reply) {
          var resource = route.resource.split('@');
          var controller = require(path.join(__dirname, 'controllers', resource[0]));
          var instance = new controller();
          var method = instance[resource[1]];

          if (_.isFunction(method)) {
            method.call(instance, req, reply);
          }

          if (!reply._replied) {
            return reply({
              statusCode: 404,
              error: 'Resource [' + route.resource + '] not found'
            }).code(404);
          }
        };
      }

      server.route(_.omit(route, 'resource'));
    });
  }

  return server;
};

module.exports.internal = server;
