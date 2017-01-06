"use strict";

// Mongo Rest Endpoints
/**
Plugins are very simple to write.
At their core they are an object with a register function that has the signature function (server, options, next). That register function then has an attributes object attached to it to provide hapi with some additional information about the plugin, such as name and version.
**/
const Promise = require("bluebird");
//Import Models
var batchFlowModels = require('../../models/batchFlow');
var Job = batchFlowModels.Job;
var Link = batchFlowModels.Link;
var Feedback = batchFlowModels.Feedback;

var addRoutesForLinks = (server) => {
  //GET request for testing
  server.route({
    method: 'GET',
    path: '/check2',
    handler: (request, reply) => reply('yup! works2')
  });

  //add POST Method
  server.route({
    method: 'POST',
    path: '/upsert-link',
    handler: function(request, reply) {
      Link.findOneAndUpdate({source: request.payload.source, target: request.payload.target}, request.payload, {upsert: true, new: true},function (err, doc){
        if(!err){ //no error
          reply(doc);
        } else { //on error
          reply('Error saving new link');
        }
      });
    }
  });

  //add GET method for retreiving all jobs
  server.route({
    method: 'GET',
    path: '/all-links',
    handler: function(request, reply) {
      Link.find({}, function(err, links) {
        if(!err) { //no error
          reply(links);
        } else { //on error
          reply('Error while retreiving all links');
        }
      });
    }
  });
};

var addRoutesForNodes = (server) => {
  //add POST Method
  server.route({
    method: 'POST',
    path: '/new-job',
    handler: function(request, reply) {
      var job = new Job();
      job.id = request.payload.id;
      job.group = request.payload.group;
      job.tags = request.payload.tags;
      job.otherInfo = request.payload.otherInfo;
      job.save(function (err){
        if(!err){ //no error
          reply(job);//.created('/check')
        } else { //on error
          reply('Error saving new job');
        }
      });
    }
  });

  //add POST Method
  server.route({
    method: 'POST',
    path: '/upsert-job',
    handler: function(request, reply) {
      Job.findOneAndUpdate({id: request.payload.id}, request.payload, {upsert: true, new: true},function (err, doc){
        if(!err){ //no error
          reply(doc);//.created('/all-jobs')
        } else { //on error
          reply('Error saving new job');
        }
      });
    }
  });

  //add GET method for retreiving all jobs
  server.route({
    method: 'GET',
    path: '/all-jobs',
    handler: function(request, reply) {
      Job.find({}, function(err, jobs) {
        if(!err) { //no error
          reply(jobs);
        } else { //on error
          reply('Error while retreiving all jobs');
        }
      });
    }
  });
};

var addRoutesForFeedback = (server) => {
  server.route({
    method: 'POST',
    path: '/postFeedback',
    handler: (request, reply) => {
      var feedback = new Feedback();
      console.log(feedback, request.payload);
      feedback.windowLocation = request.payload.windowLocation;
      feedback.reportedBy = request.payload.reportedBy;
      feedback.feedbackText = request.payload.feedbackText;
      feedback.save(function (err){
        if(!err){ //no error
          reply(feedback);//.created('/check')
        } else { //on error
          reply('Error saving new job');
        }
      });
    }
  });
};

//Start the plugin definition

const restMongo = {}



//restMongo Define all the functions in here.
restMongo.register = (server, options, next) => {
  //GET request for testing
  server.route({
    method: 'GET',
    path: '/check',
    handler: (request, reply) => reply('yup! works')
  });

  //Adding routes for nodes
  addRoutesForNodes(server);
  //Adding routes for manipulating links
  addRoutesForLinks(server);

  addRoutesForFeedback(server);

  //Construct a grpah and return.
  server.route({
    method: 'GET',
    path: '/getGraphData',
    handler: (request, reply) => {
      var graph = {};
      var p1 = Job.find({}, function(err, jobs) {
        if(!err) { //no error
          graph.nodes = jobs;
        } else { //on error
          reply('Error while retreiving all jobs');
        }
      });
      var p2 = Link.find({}, function(err, links) {
        if(!err) { //no error
          graph.links = links;
        } else { //on error
          reply('Error while retreiving all links');
        }
      });
      Promise.all([p1, p2]).then(function(response){
        reply(graph);
      }).catch(function(error){
        console.log(erorr);
        reply('error retreiving data');
      });
    }
  })

  next();
};

//restMongo register the plugin
restMongo.register.attributes = {
  name: "restMongoPlugin",
  version: "0.0.1"
};


//JS Modules
module.exports = restMongo
