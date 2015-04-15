var Path = require('path')

module.exports = [

  { // Index
    method: 'GET',
    path: '/api/songs',
    config: {
      handler: function(request, reply) {
        reply([])
      }
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
      handler: function(request, reply) {
        reply({})
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
      plugins: { 'hapi-spa': { handler: {'file', Path.join(__dirname, './public/index.html')} } },
      handler: {
        directory: { path: Path.join(__dirname, './public') }
      }
    }
  }
]