var port    = 5000;
var express = require('express');
var app     = express();
var server  = require('http').Server(app);
var path    = require('path');

// MORGAN
app.use(require('morgan')('dev'));

app.use("/bower_components", express.static(path.join(__dirname, '/bower_components')));
app.use("/public", express.static(path.join(__dirname, '/public')));
app.use("/uploads", express.static(path.join(__dirname, '/uploads')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(port, function () {
  console.info('Successfully restarted application');
});