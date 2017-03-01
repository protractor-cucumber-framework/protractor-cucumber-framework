var express = require('express');

var webServerPort = process.env.HTTP_PORT || require("./spec/environment").webServerDefaultPort;

var app = express();
app.use(express.static('testapp'));

app.listen(webServerPort, function() {
    console.log('Server started on port: ' + webServerPort);
});