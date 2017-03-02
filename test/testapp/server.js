let path = require('path');
let express = require('express');

let webServerPort = process.env.HTTP_PORT || require("../cucumber/environment").webServerDefaultPort;

let app = express();
app.use(express.static(__dirname));

app.listen(webServerPort, function() {
  console.log('Server started on port: ' + webServerPort);
});
