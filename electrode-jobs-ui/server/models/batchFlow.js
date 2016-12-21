var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

//Data Schema for the jobs/nodes.
var jobSchema = new Schema({
  id : {type: String, required: true, trim: true, unique: true},
  group : {type: String, required: true, trim: true},
  dateUpdated : { type: Date, required: true, default: Date.now()}
});

//Link Schema
var linkSchema = new Schema({
  source : {type: String, required: true, trim: true},
  target : {type: String, required: true, trim: true}
});
linkSchema.index({source:1, target:1}, {unique: true}); //Add a schema.

var job = Mongoose.model('grs_job', jobSchema);
var link = Mongoose.model('link_jobs', linkSchema);


// Export the Job and Link model.
module.exports = {
  Job : job,
  Link : link
};

// {
//   "nodes": [
//     {
//       "id": "job1",
//       "group": "fulfillment"
//     },
//     {
//       "id": "job2",
//       "group": "demand"
//     },
//     {
//       "id": "job3",
//       "group": "demand"
//     }
//   ],
//   "links": [
//     {
//       "source": "job1",
//       "target": "job2"
//     },
//     {
//       "source": "job3",
//       "target": "job2"
//     }
//   ]
// }