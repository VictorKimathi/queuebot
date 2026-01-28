const http = require('http');
const app = require('./src/app');

function createServer() {
  return http.createServer(app);
}

module.exports = { createServer };

