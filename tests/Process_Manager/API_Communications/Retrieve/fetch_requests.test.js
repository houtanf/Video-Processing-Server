const { getRequests } = require('../../../../src/Process_Manager/API_Communications/Retrieve/fetch_requests');

const url = 'something.com', logger = jest.fn();

test('test getRequests with correct input', async() => {
  const requests = { requests: ['algo1'] };

  const response = { 
                      ok: true,
                      json: () => requests
                   };

  const fetch = jest.fn(() => Promise.resolve(response));

  const callback = jest.fn();

  await getRequests(url, callback, fetch, null);

  expect(fetch).toBeCalledWith(url);

  expect(callback).toBeCalledWith(requests);
});


test('test getRequests with incorrect response code', async() => {
  const response = { 
                      ok: false,
                      json: null
                   };

  const fetch = jest.fn(() => Promise.resolve(response));

  await getRequests(url, null, fetch, logger);

  expect(fetch).toBeCalledWith(url);

  expect(logger).toBeCalledWith('Incorrect Response Code');
});


test('test getRequests with json parsing error', async() => {
  const response = { 
                      ok: true,
                      json: () => { throw { message: 'Parsing Error' }; }
                   };

  const fetch = jest.fn(() => Promise.resolve(response));

  await getRequests(url, null, fetch, logger);

  expect(fetch).toBeCalledWith(url);

  expect(logger).toBeCalledWith('Parsing Error');
});


test('test getRequests with fetching error', async() => {
  const fetch = jest.fn(() => Promise.reject({ message: 'error' }));

  await getRequests(url, null, fetch, logger);

  expect(fetch).toBeCalledWith(url);

  expect(logger).toBeCalledWith('error');
});
