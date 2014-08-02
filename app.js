var express = require('express');
var http = require('http');
var app = express();


app.set('port', process.env.PORT || 7004);
//app.use(express.bodyParser());
//app.use(express.mothodOverride());
app.use(express.static(__dirname + "/www"));
//app.use(express.logger());


app.get('/*', function(req, res) {
  res.sendfile(__dirname + "/www/index.html");
});
var server = app.listen(app.settings.port);