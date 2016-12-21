"use strict";

// Mongo Rest Endpoints
/**
Plugins are very simple to write.
At their core they are an object with a register function that has the signature function (server, options, next). That register function then has an attributes object attached to it to provide hapi with some additional information about the plugin, such as name and version.
**/

const restMongo = {}

//restMongo Define all the functions in here.
restMongo.register = (server, options, next) => {
  server.route({
    method: "GET",
    path: "/check",
    handler: (request, reply) => reply('yup! works')
  });
  next();
};

//restMongo register the plugin
restMongo.register.attributes = {
  name: "restMongoPlugin",
  version: "0.0.1"
};


//JS Modules
module.exports = restMongo
