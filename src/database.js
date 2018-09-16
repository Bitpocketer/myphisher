
var mongoose = require('mongoose');

// //connect with mongodb
// module.exports=mongoose.connect('mongodb://127.0.0.1:27017/ns');

// var mongoose = require('mongoose');

// module.exports =mongoose.connect('mongodb://localhost:27017/ns', { useMongoClient: true })
// / mLab here
module.exports = mongoose.connect(
  "mongodb://jawad:aisha1234@ds121312.mlab.com:21312/testdbb").then(()=>console.log("Connection made"));

//   mongodb://<dbuser>:<dbpassword>@ds121312.mlab.com:21312/testdbb