const path = require('path');

const { BeforeAll } = require('cucumber');

BeforeAll(function(callback) {
  callback('Failed');
});
