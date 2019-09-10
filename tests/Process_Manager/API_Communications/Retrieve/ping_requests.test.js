jest.mock('../../../../src/Process_Manager/API_Communications/Retrieve/fetch_requests');
jest.useFakeTimers();
jest.runOnlyPendingTimers();

const fetch = require('node-fetch');
const { getRequests } = require('../../../../src/Process_Manager/API_Communications/Retrieve/fetch_requests');
const { pingRequests } = require('../../../../src/Process_Manager/API_Communications/Retrieve/ping_requests');

const url = 'something.com';
const callback = 'doesnt matter';
const sleep = 1;
const log = 'also dont matter';
const fetcher = 'does not matter';


afterEach(() => {
  getRequests.mockReset();
  setInterval.mockReset();
  jest.clearAllTimers();
});


test('test pingRequest with correct data', () => {
  pingRequests(url, callback, sleep, log, fetcher);

  expect(getRequests).toBeCalledWith(url, callback, fetcher, log);

  expect(setInterval.mock.calls[0][1]).toBe(sleep);
});


test('test pingRequest using defaults', () => {
  pingRequests(null, null);

  expect(getRequests).toBeCalledWith(null, null, fetch, console.log);

  expect(setInterval.mock.calls[0][1]).toBe(1000);
});
