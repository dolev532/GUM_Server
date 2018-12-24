var http = require('http');

//var express = require('express');
//var edge = require('edge-js');

//var connectionStr = "Data Source=DOLEV_MAIN\\SQLEXPRESS;Database=GUM;Integrated Security=True";

var connectionStr="Server=tcp:gum.database.windows.net,1433;Initial Catalog=GUM_DB;Persist Security Info=False;User ID=GUM;Password=GISRAELUM!1!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30";

var server = http.createServer(function(request, response) {

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("Hello World!");

});

var port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
