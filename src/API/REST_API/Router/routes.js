const express = require('express');
const bp = require('body-parser');

const { getPending,
        updateResults } = require('../Database_Communications/db_communications');

const { handleClientError,
        handleRequest,
        handleAuthentication } = require('./route_handlers');

const server = express();

const initRoutes = function(dbCallers, authenticator) {
  server.get('/retrieve', handleRequest(getPending, dbCallers));

  server.post('/submit', bp.json(),
                         handleClientError,
                         handleAuthentication(authenticator),
                         handleRequest(updateResults, dbCallers));
};


const startServer = function(port) {
  server.listen(port, () => console.log(`REST API listening on port ${port}`));
};


module.exports = { startServer, initRoutes };
