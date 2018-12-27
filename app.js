var http = require('http');
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;

var express = require('../../node_modules/express');
var app = express();


var server = http.createServer(function(request, response) {

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("Hello World!");

});

var port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
