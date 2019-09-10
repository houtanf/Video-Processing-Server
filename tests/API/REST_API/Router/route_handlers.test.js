const handler = require('../../../../src/API/REST_API/Router/route_handlers');
const mock = jest.fn(), mockStatus = jest.fn();

test('test handleRequest with correct input', async() => {
  const req = { body:  'correct2' };

  const mockCallback = jest.fn(() => 'OK');

  const res = { status: function(code) { 
    return { send: mockStatus.bind(null, code) }; 
  } };

  const someCallback = () => 'something';

  await handler.handleRequest(mockCallback, someCallback, req, res);

  expect(mockCallback).toBeCalledWith(req.body, someCallback);

  expect(mockStatus).toBeCalledWith(200, 'OK');
});

test('test handleRequest with callback server exception', () => {
  const mockCallback = (files, body) => {throw {  type: 'Server Error',
                                                  message: 'bad stuff' };
                                        };

  const res = { status: function(code) { 
    return { send: mockStatus.bind(null, code) }; 
  } };

  handler.handleRequest(mockCallback, null, {}, res);

  expect(mockStatus).toBeCalledWith(500, 'bad stuff');
});

test('test handleRequest with callback client exception', () => {
  const mockCallback = (files, body) => {throw {  type: 'Client Error',
                                                  message: 'bad stuff' };
                                        };

  const res = { status: function(code) { 
    return { send: mockStatus.bind(null, code) }; 
  } };

  handler.handleRequest(mockCallback, null, {}, res);

  expect(mockStatus).toBeCalledWith(400, 'bad stuff');
});


test('test handleClientError, no error', () => {
  handler.handleClientError(null, null, null, mock);

  expect(mock).toBeCalled();
});

test('test handleClientError, with error', () => {
  const res = { sendStatus: mockStatus };

  handler.handleClientError(true, null, res, null);

  expect(mockStatus).toBeCalledWith(400);
});


test('test handleAuthentication with correct password', () => {
  const req = { body: { key: 'password' } };

  const res = { sendStatus: jest.fn() };

  const authenticator = jest.fn().mockReturnValue(true);

  const next = jest.fn().mockReturnValue('yay');

  const returned = handler.handleAuthentication(authenticator, req, res, next);

  expect(returned).toMatch('yay');

  expect(authenticator).toBeCalledWith(req.body.key);

  expect(next).toBeCalled();

  expect(res.sendStatus).not.toBeCalled();
});


test('test handleAuthentication with incorrect password', () => {
  const req = { body: { key: 'password' } };

  const res = { sendStatus: jest.fn() };

  const authenticator = jest.fn().mockReturnValue(false);

  const next = jest.fn().mockReturnValue('yay');

  const returned = handler.handleAuthentication(authenticator, req, res, next);

  expect(returned).toBe(undefined);

  expect(authenticator).toBeCalledWith(req.body.key);

  expect(next).not.toBeCalled();

  expect(res.sendStatus).toBeCalledWith(401);
});


test('test handleAuthentication with exception', () => {
  const req = { body: { key: 'password' } };

  const res = { sendStatus: jest.fn() };

  const authenticator = jest.fn(() => { throw 'error'; });

  const next = jest.fn().mockReturnValue('yay');

  const returned = handler.handleAuthentication(authenticator, req, res, next);

  expect(returned).toBe(undefined);

  expect(authenticator).toBeCalledWith(req.body.key);

  expect(next).not.toBeCalled();

  expect(res.sendStatus).toBeCalledWith(401);
});
