var Path = require('path')
var songsdb = require('./songsdb');

module.exports = [

  { // Index
    method: 'GET',
    path: '/api/songs',
    config: {
      handler: function(request, reply) {

        songsdb.get(request, reply);

      }
      /*
      handler: function(request, reply) {
        reply([])
      }
      */
    }
  },

  { // Read
    method: 'GET',
    path: '/api/songs/{id}',
    config: {
      handler: function(request, reply) {
        reply({})
      }
    }
  },

  { // Create
    method: ['POST', 'PUT'],
    path: '/api/songs',
    config: {
      payload: {output: "data", parse: true},
      handler: function(request, reply) {
        console.log("create");
        songsdb.create(request, reply);
        console.log("create done");
//        reply({})
      }
    }
  },

  { // Update
    method: ['POST', 'PUT'],
    path: '/api/songs/{id}',
    config: {
      handler: function(request, reply) {
        reply({})
      }
    }
  },

  {
    method: 'DELETE',
    path: '/api/songs/{id}',
    config: {
      handler: function(request, reply) {
        reply({})
      }
    }
  },

  { // static files
    method: 'GET',
    path: '/{param*}',
    config: {
      plugins: {
        'hapi-spa': {
          method: 'file',
          args: [Path.join(__dirname, './public/index.html')]
        }
      },
      handler: {
        directory: { path: Path.join(__dirname, './public') }
      }
    }
  }
]