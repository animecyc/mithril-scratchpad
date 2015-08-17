var server = require('./core/server');
var router = require('./core/server/router');

server({
  routes: router(function(route) {
    return [
      route.resource('notes', 'NoteController', {
        basePath: 'api'
      }),
      route.get('/{path*}', null, {
        handler: {
          directory: {
            path: 'public'
          }
        }
      })
    ];
  })
}).start(function() {
  console.log('#scratchpad server started on port ' + server.internal.info.port + '...');
});
