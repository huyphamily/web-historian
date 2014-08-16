var http = require("http");
var handler = require("./request-handler");

var port = 8080;
var ip = "127.0.0.1";
var server = http.createServer(function(request, response){
  console.log("received message for "+ request.url);
  handler.handleRequest(request, response);
});
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);

