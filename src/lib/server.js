//REST server
var Server = function(){
  var Router = require('paper-router');
  var restify = require('restify');
  var bunyan = require('bunyan');
  var logger = bunyan.createLogger({
    name: 'audit',
    stream: process.stdout
  });

  var server = restify.createServer({
    name: 'trip-service',
    log: logger
  });
  
  //load plugins
  server
    .use(restify.fullResponse())
    .use(restify.bodyParser())
    .use(restify.queryParser())
    .use(restify.requestLogger())
    .use(restify.gzipResponse())
  ;

  //log server requests
  server.on('after', restify.auditLogger({
    log: logger
  }));

  //log uncaught exceptions
  server.on('uncaughtException', function(req, res, route, err){
    logger.error(err);
    res.send(err);
  });

  server.listen(process.env.PORT, function(){
    logger.info('%s listening at %s', server.name, server.url);
  });

  //define routes
  var routes = function(router){
    router.resources('trip');
  }

  //load routes into server
  var router = new Router(server, __dirname + '/../controllers', routes);

};

module.exports = Server;