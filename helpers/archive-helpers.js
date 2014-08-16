var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!


// Get the webpage, and send to user
exports.get = function(url, response, report){
  // Check if url is in list
  exports.isUrlInList(url, function(data, archive){
    //if not then send error
    if(data === false){
      //
      console.log('failed isInList');
      report(response, "NOT FOUND", 404);
    }
    else {
    //if it is
    exports.isURLArchived(archive, function(data, pathToFiles){

      if(data === false){
        //if not, send error
        console.log('isURLArchived');
        report(response, "NOT FOUND", 404);
      }
      else{
        //if it is
        //send the data
          //to who?\
            //$response
        exports.downloadUrls(pathToFiles, response);

      }

    });
    }
  });

};

exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, {'encoding': 'utf-8'}, callback);
};

//checks if in list, returns true false
exports.isUrlInList = function(url, callback){
  //reads the list
  exports.readListOfUrls(function(err, data){
    //do something to compare
    if(err){
      //logit
      console.log(err);
    }else{
      var sites =  JSON.parse(data);
      var archive = sites[url];
      console.log('url is =>', url);
      console.log('sites is =>', sites);
      console.log('archive is =>', archive);
      callback((archive !== undefined), archive);
    }

  });
  //checks if url is in list
  //if it is in the list, do something
  //if not 
};

exports.addUrlToList = function(){
  //get the list
  //parsefrom json
  //is it already in the list?
  //if not, add it to the list as key, with value as null
    //parse to json 
    //write json to file
};

exports.isURLArchived = function(archive, callback){
  if(archive === null){
    callback(false);
  } else {
    fs.exists(archive, function(bool){
        callback(bool, archive);
    });
  }
};

exports.downloadUrls = function(path, response){
  //get the file contents
  fs.readFile(path, function(err, data){
    //send file contents
    if(err){
      console.log(err);
    } else {
      response.writeHead(200);
      response.end(data);
    }
  });
  
};
