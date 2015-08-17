var _ = require('lodash');
var path = require('path');

/**
 * Route Model
 *
 * @param {string} uri
 * @param {string} resource
 * @param {object} config
 */
function Route(method, uri, resource, config) {
  this.method = method;
  this.path = uri;
  this.resource = resource;
  this.config = config || {};
}

/**
 * Router
 *
 * @constructor
 */
function Router() {}

/**
 * Generate a route with the GET method
 *
 * @param  {string} uri
 * @param  {string} resource
 * @param  {object} config
 * @return {Route}
 */
Router.prototype.get = function(uri, resource, config) {
  return new Route('GET', uri, resource, config);
};

/**
 * Generate a route the with POST method
 *
 * @param  {string} uri
 * @param  {string} resource
 * @param  {object} config
 * @return {Route}
 */
Router.prototype.post = function(uri, resource, config) {
  return new Route('POST', uri, resource, config);
};

/**
 * Generate a route with the PUT method
 *
 * @param  {string} uri
 * @param  {string} resource
 * @param  {object} config
 * @return {Route}
 */
Router.prototype.put = function(uri, resource, config) {
  return new Route('PUT', uri, resource, config);
};

/**
 * Generate a route with the DELETE method
 * @param  {string} uri
 * @param  {string} resource
 * @param  {object} config
 * @return {Route}
 */
Router.prototype.delete = function(uri, resource, config) {
  return new Route('DELETE', uri, resource, config);
};

/**
 * Generate a collection of resource routes.
 *
 * @param  {string} uri
 * @param  {string} controller
 * @param  {object} config
 * @return {Array}
 */
Router.prototype.resource = function(uri, controller, config) {
  config = config || {};
  uri = uri.split('.') || [];

  var resource = _.last(uri);
  var basePath = '/' + (config.basePath || '');

  if (uri.length > 1) {
    _.each(_.initial(uri), function(resource) {
      basePath = path.join(basePath, resource, '{' + resource + '}');
    });
  }

  // Generate all the routes that a resource would require
  var routes = {
    index: this.get(path.join(basePath, resource), controller + '@index'),
    create: this.get(path.join(basePath, resource, 'create'), controller + '@create'),
    show: this.get(path.join(basePath, resource, '{' + resource + '}'), controller + '@show'),
    edit: this.get(path.join(basePath, resource, '{' + resource + '}', 'edit'), controller + '@edit'),
    store: this.post(path.join(basePath, resource), controller + '@store'),
    update: this.put(path.join(basePath, resource, '{' + resource + '}'), controller + '@update'),
    destroy: this.delete(path.join(basePath, resource, '{' + resource + '}'), controller + '@destroy')
  };

  // Filter the routes before we pass them along
  if (config.hasOwnProperty('except')) {
    routes = _.omit(routes, config.except);
  } else if (config.hasOwnProperty('only')) {
    routes = _.pick(routes, config.only);
  }

  return _.values(routes);
};

module.exports = function(callback) {
  var router = new Router();
  var routes = _.flatten(callback(router) || []);

  // possibly do some sort of post-processing here?

  return routes;
};

module.exports.InternalRoute = Route;
module.exports.InternalRouter = Router;
