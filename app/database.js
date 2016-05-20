var async = require("async");

function Database(appEnv, serviceName, dbName, waterfallCallback) {
  var self = this;

  console.log("Initializing database...");
  
  console.log("\n\nappEnv database= "+ JSON.stringify(appEnv));
  console.log("\n\nappEnv database= "+ JSON.stringify(appEnv.getServiceCreds(serviceName)));
  console.log("\n\nappEnv servicename= "+ serviceName);
  var cloudant = require('nano')(appEnv.getServiceCreds(serviceName).url).db;
  var todoDb;
  var prepareDbTasks = [];

  // create the db
  prepareDbTasks.push(
    function (callback) {
      console.log("Creating database...");
      cloudant.create(dbName, function (err, body) {
        if (err && err.statusCode == 412) {
          console.log("Database already exists");
          callback(null);
        } else if (err) {
          callback(err);
        } else {
          callback(null);
        }
      });
    });

  // use it
  prepareDbTasks.push(
    function (callback) {
      console.log("Setting current database to", dbName);
      todoDb = cloudant.use(dbName);
      callback(null);
    });

//------------------------------ To populate Db with initial documents

//var conf = require('./config.json');
//var listOfTracks = [];

//listOfTracks = conf;

//console.log('Before Loop APP.JS', listOfTracks.length);
//for (i = 0; i < conf.length; i++) {
//listOfTracks[i]=conf.listoftracks.i;
//console.log('In Loop APP.JS  ---->', listOfTracks[i]);
//}
  
  
  async.waterfall(prepareDbTasks, function (err, result) {
    if (err) {
      console.log("Error in database preparation", err);
    }

    waterfallCallback(err, todoDb);
  });

}

// callback(err, database)
module.exports = function (appEnv, serviceName, dbName, callback) {
  return new Database(appEnv, serviceName, dbName, callback);
}