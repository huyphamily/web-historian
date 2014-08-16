var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var helpers = require('./http-helpers');
var urlParser = require('url');



var getRequest = function(req, res){
/*  var url = routeMap[req.url.toString()];
  if(!url){
    sendRequest(res, "", 404);
    return;
  }*/
  // console.log('Req URL:', req.url);
  var url = req.url.split('/');
  //gets rid of empty element at index 0
  url.shift();
  // console.log('url is:', url);
  //if req.url == /, then send to public/index.html or req.url == /public/something ==> helpers.serveAsset
  if( req.url === '/' || url[0] === 'public'){
    helpers.serveAssets(res, req.url, function(error, data){
      if(error){
        console.log(error);
      }
      sendRequest(res, data);
    });
  } else {
    //if req.url == /anything ==> check archives
    url = url[0];
    // console.log('url parser:', url);
    if ( url ){
      //run archive handler on req.url
      archive.get(url, res, sendRequest);
    } else {
      //send 404
      sendRequest(res, 'NOT-FOUND', 404);
    }

    
  }

  //
  
};

var postRequest = function(req, res){
  sendRequest(res);
};

var sendRequest = function(response, data, statusCode){
  statusCode = statusCode || 200;
  response.writeHead(statusCode, helpers.headers);
  response.end(data);
};

exports.handleRequest = function (req, res) {
  var type = req.method;
  if( type === 'GET' || type === 'OPTIONS' ){
    getRequest(req, res);
  } else if( type === 'POST'){
    postRequest(req, res);
  }
};


// archive.paths.list