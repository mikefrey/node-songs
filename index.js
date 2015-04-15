var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: 3000 });

server.register([
  {
    register: require('good'),
    options: {
      reporters: [{
        reporter: require('good-console'),
        events: [{ log: '*', request: '*', response: '*' }]
      }]
    }
  }
], function(err) {

  server.start(function () {
    console.log('Server running at:', server.info.uri);
  })

})

