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
exports.get = function(url, response, report, callback){
  // Check if url is in list

  exports.isUrlInList(url, function(data, archive, siteList){
    //if not then send error
    if(data === false){
      if(typeof callback === 'function'){
          url = url.split('=').pop();
          callback(url, siteList, report);
       } else {
        report(response, "NOT FOUND", 404);
      }
    } else {
    //if it is
      exports.isURLArchived(archive, function(data, pathToFiles){
        if(data === false){
          report(response, "NOT FOUND", 404);
        }
        else{
          exports.downloadUrls(pathToFiles, response, report);
        }
      });
    }
  });
};


exports.post = function(request, response, report){
  var data = '';
  request.on('data', function(partial){
      data += partial;
  });
  request.on('end', function(){
    exports.get(data, response, report, function(url, siteList, report){
      exports.addUrlToList(url, siteList, function (loading){
        report(response, loading, 302);
      });
    });
  });
};

exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, {'encoding': 'utf-8'}, function(err,data){
    var parsed = {};
    try {
      if(data !== ""){
        parsed = JSON.parse(data);
      }
      callback(err, parsed);
    } catch(e) {
      callback(err);
    }
  });
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
      var sites =  data;
      var archive = sites[url];
      callback((archive !== undefined), archive, sites);
    }

  });

};

//null values means it has not been archived
exports.addUrlToList = function(url, siteList, callback){
  siteList[url] = null;
  var save = JSON.stringify(siteList);
  fs.writeFile(exports.paths.list,save, function(err){
      fs.readFile(exports.paths.siteAssets + '/loading.html', "utf8",function(err,data){
        callback(data);
      });
  });
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
