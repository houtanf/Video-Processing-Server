jest.mock('node-fetch');

const sinon = require('sinon');
const fetch = require('node-fetch');
const bluebird = require('bluebird');
const { readFile } = require('fs');
let readResults;
let sendResults;

let mockFetch;
let sandbox;
let resolved;
const jsonString = '{ "data": 1 }';

beforeEach(() => {
  sandbox = sinon.createSandbox();

  sandbox.stub(bluebird, 'promisify')
    .withArgs(readFile)
    .returns(() => Promise.resolve(jsonString));

  mockFetch = jest.fn(() => Promise.resolve('yay'));

  readResults = require('../../../../src/Process_Manager/API_Communications/Send/send_results').readResults;
  sendResults = require('../../../../src/Process_Manager/API_Communications/Send/send_results').sendResults;
});

afterEach(() => {
  sandbox.restore();
  fetch.mockReset();
});

test('readResults with correct input using default read function', () => {
  const path = './some/where/';
  const jsonParsed = { data: 1 };

  const data = readResults(path);

  return expect(data).resolves.toEqual(jsonParsed);
});


test('sendResults using defaults', async() => {
  const url = 'something.com';

  const results = { data: 1 };

  const send = jest.fn().mockResolvedValue('yay');

  const options = {
                     method: 'post',
                     body: '{"data":1}',
                     headers: { 'Content-Type': 'application/json' }
                  };

  await sendResults(url, results);

  expect(fetch).toBeCalledWith(url, options);
});

