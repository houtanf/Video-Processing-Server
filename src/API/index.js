'use strict';
const database = require('./Database/mongodb_connector');
const { update, findAndUpdate } = require('./Database/database_utils');
const server = require('./REST_API/Router/routes');
const { hashCompare } = require('./REST_API/Authentication/authenticate.js');

const { databaseUrl,
        apiPort,
        password } = require('../../api_config.json');

const db = database.establishConnection(databaseUrl);

const dbCallers = {
  update: update.bind(null, db),
  findAndUpdate: findAndUpdate.bind(null, db)
};

const authenticator = hashCompare.bind(null, password);

server.initRoutes(dbCallers, authenticator);
server.startServer(process.env.PORT || apiPort);
