jest.mock('express');
jest.mock('body-parser');
jest.mock('../../../../src/API/REST_API/Router/route_handlers');


const express = require('express');
const bp = require('body-parser');

bp.json = jest.fn();
console.log = jest.fn();
const server = {
  get: jest.fn(),
  post: jest.fn(),
  listen: jest.fn()
};
express.mockReturnValue(server);

const { getPending, 
        updateResults } = require('../../../../src/API/REST_API/Database_Communications/db_communications');

const { handleClientError,
        handleRequest,
        handleAuthentication } = require('../../../../src/API/REST_API/Router/route_handlers');

const { startServer, initRoutes } = require('../../../../src/API/REST_API/Router/routes');


const port = 8080;
const msg = 'REST API listening on port 8080';
const dbCallers = { x: 'doesnt matter' };
const auth = 'doesnt matter';

afterEach(() => {
  server.get.mockReset();
  server.post.mockReset();
  server.listen.mockReset();

  handleRequest.mockReset();
  handleAuthentication.mockReset();

  bp.json.mockReset();
  console.log.mockReset();
});
  

test('test startServer is correctly executed', () => {
  server.listen.mockImplementation((_, f) => f());

  startServer(port);

  expect(server.listen.mock.calls[0][0]).toBe(port);

  expect(console.log).toBeCalledWith(msg);
});


test('test initRoutes executes correctly', () => {
  bp.json.mockReturnValue('bp');
  handleRequest.mockReturnValue('handled');
  handleAuthentication.mockReturnValue('authed');

  initRoutes(dbCallers, auth);

  expect(server.get).toBeCalledWith('/retrieve', 'handled');

  expect(server.post)
    .toBeCalledWith('/submit', 'bp', handleClientError, 'authed', 'handled');

  expect(handleRequest).toBeCalledWith(getPending, dbCallers);

  expect(handleAuthentication).toBeCalledWith(auth);

  expect(handleRequest).toBeCalledWith(updateResults, dbCallers);
});
