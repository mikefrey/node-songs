/*
USAGE

Generally should be used on a static handler route:

server.route({
  method: 'GET',
  path: '/{param*}',
  config: {
    plugins: { 'hapi-spa': options },
    handler: {
      directory: { path: pathToPublic }
    }
  }
})

Options can look like one of the following:

  1. Direct `reply` method call
    { method: 'methodName', args: [arg1, arg2, arg3] }
    Which gets applied like: `reply.method(arg1, arg2, arg3)`

    Example: { method: 'file', args: ['some/path/to/file.html'] }
    will reply to the client with the specified file.

    Example: { method: 'view', args: ['home'] }
    will render the home view.

  2. Custom handler function
    { handler: function(request, reply) { ... } }

*/

var Negotiator = require('negotiator')
var _ = require('lodash')

exports.register = function(server, options, next) {

  server.ext('onPostHandler', function(request, reply) {

    var resp = request.response
    var handler = request.route.settings.plugins['hapi-spa']

    // Send the normal response if it's not an error,
    // or if boom error is not 404 or if it's not cofigured.
    if (!resp.isBoom || resp.output.statusCode != 404 || !handler) {
      return reply.continue()
    }

    handler = _.extend({}, options, handler || {})
    if (handler.handler) handler = handler.handler

    var neg = new Negotiator(request.raw.req)
    var selectedMediaType = neg.mediaType()

    // if the client isn't looking for html,
    // the the response continue normally.
    if (selectedMediaType != 'text/html') {
      return reply.continue()
    }

    if (typeof handler == 'function') {
      // if handler is a function, execute it like
      // any normal handler.
      return handler(request, reply)
    }

    if (typeof handler == 'object') {
      // if handler is an object, assume signature of
      // { method: Function, args: Array }
      return reply[handler.method].apply(reply, handler.args)
    }

  })

  next()
}

exports.register.attributes = {
  name: 'hapi-spa',
  version: '1.0.0'
}
