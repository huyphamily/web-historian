// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.
var archive = require('../helpers/archive-helpers'),
  req = require('request'),
  fs = require('fs'),
  up = require('url');

  /*
  var uA = up.parse('http://www.google.com').hostname;
  var uB = up.parse('www.google.com').hostname;
  console.log(uA);
  console.log(uB);
  */

/*
  req.get('http://www.google.com', function(err, response, body){
    console.log(body);
  });
*/
var jobs;
var siteList;
//reads the url list \w archive.readlistofurls
var getUrls = function(){
  archive.readListOfUrls(function(err, data){
    //Get the urls from the internet, req()
    siteList = data;
    console.log(data, 'in getUrls');
    console.log(siteList, 'in getUrls');
    jobs = Object.keys(siteList).length;
    for(var url in siteList){
      if(siteList[url] === null){
        console.log(siteList[url], "<== null");
        getSiteContents(url);
      } else {
        jobs--;
      }
    }
  });
};


var getSiteContents = function(url){
  var proto = 'http://';

  //save url to archive/sites folder
  req(proto + url, function(err, response, body){
    var path = archive.paths.archivedSites + '/' + url;
    fs.writeFile(path, body, function(err){
      fs.exists(path, function(exists){
        if(!exists){
          path = null;
        }
        else{
          path = './archives/sites/' + url;
        }
        siteList[url] = path;
        jobs--;
        if(jobs === 0){
          //we're done
          console.log(siteList, 'getSiteContents');
          cleanUp();
        }
      });
    });
  });
};

var cleanUp = function(){
  var save = JSON.stringify(siteList);
  console.log(save, 'in cleanup');
  fs.writeFile(archive.paths.list, save, function(err){
    //
  });
};

getUrls();
//getSiteContents('www.google.com');
//Update paths in sites.txt



//sites.txt 
// {
//  "url1": "null",
//  "url2": "./archive/sites/url2"
// }