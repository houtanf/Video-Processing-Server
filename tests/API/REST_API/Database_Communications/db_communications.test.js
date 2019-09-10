const dbHandler = require('../../../../src/API/REST_API/Database_Communications/db_communications');


test('test updateResults with correct data', async() => {
  const body = { _id: '123',
                 requests: ['algo1'],
                 results: { algo1: {} },
                 failed: {} };

  const formattedResults = { 'results.algo1': {} };

  const query = { $pullAll: { pending: body.requests },
                  $set: formattedResults };

  const dbCallers = { update: jest.fn().mockResolvedValue({ result: {n: 1} }) };
  
  const result = await dbHandler.updateResults(body, dbCallers);

  expect(result).toBe('Results Successfully Submitted.');

  expect(dbCallers.update).toBeCalledWith(body._id, query);
});


test('test updateResults verify multiple results formatted correct', async() => {
  const body = { _id: '123',
                 requests: ['algo3', 'algo4'],
                 results: { algo3: {}, algo4: {something: 5} },
                 failed: {} };

  const formattedResults = { 'results.algo3': {},
                             'results.algo4': {something: 5}};

  const query = { $pullAll: { pending: body.requests },
                  $set: formattedResults };

  const dbCallers = { update: jest.fn().mockResolvedValue({ result: {n: 1} }) };

  const result = await dbHandler.updateResults(body, dbCallers);

  expect(result).toBe('Results Successfully Submitted.');

  expect(dbCallers.update).toBeCalledWith(body._id, query);
});


test('test updateResults with only failed data', async() => {
  const body = { _id: '123',
                 requests: ['algo1'],
                 results: {},
                 failed: { algo1: 'error' } };

  const formattedResults = { 'failed.algo1': 'error' };

  const query = { $pullAll: { pending: body.requests },
                  $set: formattedResults };

  const dbCallers = { update: jest.fn().mockResolvedValue({ result: {n: 1} }) };
  
  const result = await dbHandler.updateResults(body, dbCallers);

  expect(result).toBe('Results Successfully Submitted.');

  expect(dbCallers.update).toBeCalledWith(body._id, query);
});


test('test updateResults with one result and one failure', async() => {
  const body = { _id: '123',
                 requests: ['algo3', 'algo4'],
                 results: { algo4: {something: 5} },
                 failed: {algo3: 'error'} };

  const formattedResults = { 'failed.algo3': 'error',
                             'results.algo4': {something: 5}};

  const query = { $pullAll: { pending: body.requests },
                  $set: formattedResults };

  const dbCallers = { update: jest.fn().mockResolvedValue({ result: {n: 1} }) };

  const result = await dbHandler.updateResults(body, dbCallers);

  expect(result).toBe('Results Successfully Submitted.');

  expect(dbCallers.update).toBeCalledWith(body._id, query);
});


test('test updateResults results formatting with no results', async() => {
  const body = { _id: '123',
                 requests: [],
                 results: {},
                 failed: {} };

  const query = { $pullAll: { pending: body.requests },
                  $set: {} };

  const dbCallers = { update: jest.fn().mockResolvedValue({ result: {n: 1} }) };

  const result = await dbHandler.updateResults(body, dbCallers);

  expect(result).toBe('Results Successfully Submitted.');

  expect(dbCallers.update).toBeCalledWith(body._id, query);
});


test('test updateResults when all fields are missing', () => {
  const body = {};

  const errorMessage = 'Incorrect Request Format (Missing Fields)';

  return expect(dbHandler.updateResults(body, null))
    .rejects.toEqual({ type: 'Client Error', message: errorMessage });
});


test('test updateResults when _id field is missing', () => {
  const body = { requests: [], results: {}, failed: {} };

  const errorMessage = 'Incorrect Request Format (Missing Fields)';

  return expect(dbHandler.updateResults(body, null))
    .rejects.toEqual({ type: 'Client Error', message: errorMessage });
});


test('test updateResults when requests field is missing', () => {
  const body = { _id: '123', results: {}, failed: {} };

  const errorMessage = 'Incorrect Request Format (Missing Fields)';

  return expect(dbHandler.updateResults(body, null))
    .rejects.toEqual({ type: 'Client Error', message: errorMessage });
});


test('test updateResults when results field is missing', () => {
  const body = { _id: '123', requests: [], failed: {} };

  const errorMessage = 'Incorrect Request Format (Missing Fields)';

  return expect(dbHandler.updateResults(body, null))
    .rejects.toEqual({ type: 'Client Error', message: errorMessage });
});


test('test updateResults when failed field is missing', () => {
  const body = { _id: '123', requests: [], results: {} };

  const errorMessage = 'Incorrect Request Format (Missing Fields)';

  return expect(dbHandler.updateResults(body, null))
    .rejects.toEqual({ type: 'Client Error', message: errorMessage });
});


test('test updateResults with "wrong" ID (database returns empty result)', () => {
  const body = { _id: 'wrong id', requests: [], results: {}, failed: {} };

  const dbCallers = { update: jest.fn().mockResolvedValue({ result: {n: 0} }) };

  return expect(dbHandler.updateResults(body, dbCallers))
    .rejects.toEqual({ type: 'Client Error', message: 'Id not found.' });
});


test('test updateResults with request type error (requests is not list)', () => {
  const body = { _id: '', requests: 2, results: {}, failed: {} };

  const dbCallers = { update: jest.fn().mockRejectedValue({ code: 2 }) };

  const errorMessage = 'Incorrect Request Format (Incorrect Value Types)';

  return expect(dbHandler.updateResults(body, dbCallers))
    .rejects.toEqual({ type: 'Client Error', message: errorMessage, code: 2 });
});


test('test updateResults with database submit error', async() => {
  const body = { _id: '', requests: [], results: {}, failed: {} };

  const dbCallers = { update: jest.fn().mockRejectedValue({ code: 1 }) };

  return expect(dbHandler.updateResults(body, dbCallers))
    .rejects.toEqual({ code: 1});
});


const dbResponse = { value: { 
                              _id: 123, 
                              requests: ['algo1', 'algo2'] 
                            } };

const query = { requests: { $exists: true, $ne: [] } };

const updateQuery = { $set: { requests: [] } };

const pendingQuery = { $push: { pending: { $each: dbResponse.value.requests } } };


test('test getPending with correct data', async() => {
  const findAndUpdate = jest.fn().mockReturnValueOnce(Promise.resolve(dbResponse))
                                 .mockReturnValue(Promise.resolve({ value: null }));

  const update = jest.fn(() => Promise.resolve());

  const dbCallers = { findAndUpdate, update };

  const correctReturn = [ dbResponse.value ];

  const results = await dbHandler.getPending(null, dbCallers);

  expect(results).toEqual(correctReturn);

  expect(findAndUpdate.mock.calls.length).toBe(2);

  expect(findAndUpdate.mock.calls[0]).toEqual([query, updateQuery]);

  expect(findAndUpdate.mock.calls[1]).toEqual([query, updateQuery]);

  expect(update).toBeCalledWith(dbResponse.value._id, pendingQuery);
});


test('test getPending with database retrieve error on findAndUpdate', async() => {
  const findAndUpdate = jest.fn(() => Promise.reject('error'));

  const dbCallers = { findAndUpdate };

  const results = await dbHandler.getPending(null, dbCallers);

  expect(results).toEqual([]);

  expect(findAndUpdate.mock.calls.length).toBe(1);

  expect(findAndUpdate).toBeCalledWith(query, updateQuery);
});


test('test getPending with database retrieve error on update', async() => {
  const dbResponse = { value: { 
                                _id: 123, 
                                requests: ['algo1', 'algo2'] 
                              } };

  const findAndUpdate = jest.fn().mockReturnValueOnce(Promise.resolve(dbResponse));

  const update = jest.fn(() => Promise.reject('error'));

  const dbCallers = { findAndUpdate, update };

  const correctReturn = [ dbResponse.value ];

  const results = await dbHandler.getPending(null, dbCallers);

  expect(results).toEqual(correctReturn);

  expect(findAndUpdate.mock.calls.length).toBe(1);

  expect(findAndUpdate).toBeCalledWith(query, updateQuery);

  expect(update).toBeCalledWith(dbResponse.value._id, pendingQuery);
});
