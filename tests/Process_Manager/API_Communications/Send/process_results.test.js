console.log = jest.fn();

const { handleResults } = require('../../../../src/Process_Manager/API_Communications/Send/process_results');


const url = 'something.com';
const password = 'some password';


test('test handleResults with correct input', async() => {
  const results = [ 
                    { _id: 'something',
                      path: './some/where/',
                      request: 'algo1' }
                  ];

  const algoResult = { data: 1 };

  const get = jest.fn(() => Promise.resolve(algoResult));

  const formattedResults = {
                              key: password,
                              _id: 'something',
                              requests: ['algo1'],
                              results: { algo1: algoResult },
                              failed: {}
                           };

  const send = jest.fn();

  await handleResults(send, get, url, password, results, null);

  expect(get).toBeCalledWith('./some/where/');

  expect(send).toBeCalledWith(url, formattedResults);
});


test('test handleResults with failed data', async() => {
  const results = [ 
                    { _id: 'something',
                      error: 'some error',
                      request: 'algo1' }
                  ];

  const formattedResults = { 
                             key: password,
                             _id: 'something',
                             requests: ['algo1'],
                             results: {}, 
                             failed: { algo1: 'some error' }
                           };

  const send = jest.fn();

  await handleResults(send, null, url, password, results);

  expect(send).toBeCalledWith(url, formattedResults);
});


test('test handleResults with multiple algo results', async() => {
  const results = [ 
                    { _id: 123,
                      path: './some/where/',
                      request: 'algo1' },

                    { _id: 123,
                      path: './some/where/else/',
                      request: 'algo2' },
                  ];

  const algoResult = { data: 1 };

  const get = jest.fn(() => Promise.resolve(algoResult));

  const formattedResults = {
                              key: password,
                              _id: 123,
                              requests: ['algo1', 'algo2'],
                              results: { algo1: algoResult, algo2: algoResult },
                              failed: {}
                           };

  const send = jest.fn();

  const pathsUsed = results.map(obj => [obj.path]);

  await handleResults(send, get, url, password, results, null);

  expect(get.mock.calls.length).toBe(2);

  expect(get.mock.calls).toEqual(pathsUsed);

  expect(send).toBeCalledWith(url, formattedResults);
});


test('test handleResults with multiple algos of failed and sucessful data', async() => {
  const results = [ 
                    { _id: 123,
                      error: 'some error',
                      request: 'algo1' },

                    { _id: 123,
                      path: './some/where/else/',
                      request: 'algo2' },
                  ];

  const get = jest.fn().mockResolvedValue({ data: 1 });

  const formattedResults = {
                              key: password,
                              _id: 123,
                              requests: ['algo1', 'algo2'],
                              results: { algo2: { data: 1 } },
                              failed: { algo1: 'some error' }
                           };

  const send = jest.fn();

  await handleResults(send, get, url, password, results, null);

  expect(get.mock.calls.length).toBe(1);

  expect(get).toBeCalledWith('./some/where/else/');

  expect(send).toBeCalledWith(url, formattedResults);
});


test('test handleResults with failure to get results', async() => {
  const results = [ 
                    { _id: 'something',
                      path: './some/where/',
                      request: 'algo1' }
                  ];

  const get = jest.fn().mockRejectedValue({ message: 'error' });

  const error = 'Failed to get algo1 results from ./some/where/ for video something:\n error\n';

  const formattedResults = { 
                             key: password,
                             _id: 'something',
                             requests: ['algo1'],
                             results: {}, 
                             failed: { algo1: error }
                           };

  const send = jest.fn();

  const log = jest.fn();

  await handleResults(send, get, url, password, results, log);

  expect(get).toBeCalledWith('./some/where/');

  expect(send).toBeCalledWith(url, formattedResults);

  expect(log).toBeCalledWith(error);
});


test('test handleResults with multiple algos, where one algo fails to get results', async() => {
  const results = [ 
                    { _id: 123,
                      path: './some/where/',
                      request: 'algo1' },

                    { _id: 123,
                      path: './some/where/else/',
                      request: 'algo2' },
                  ];

  const algoResult = { data: 1 };

  const getLogic = (path) => {
    if(path === './some/where/')
      throw { message: 'error' };
    return Promise.resolve(algoResult);
  };

  const get = jest.fn(getLogic);

  const error = 'Failed to get algo1 results from ./some/where/ for video 123:\n error\n';

  const formattedResults = {
                              key: password,
                              _id: 123,
                              requests: ['algo1', 'algo2'],
                              results: { algo2: algoResult },
                              failed: { algo1: error }
                           };

  const send = jest.fn();

  const log = jest.fn();

  const pathsUsed = results.map(obj => [obj.path]);

  await handleResults(send, get, url, password, results, log);

  expect(get.mock.calls.length).toBe(2);

  expect(get.mock.calls).toEqual(pathsUsed);

  expect(send).toBeCalledWith(url, formattedResults);

  expect(log).toBeCalledWith(error);
});


test('test handleResults with processing exception on send', async() => {
  const results = [ 
                    { _id: 'something',
                      path: './some/where/',
                      request: 'algo1' }
                  ];

  const get = jest.fn().mockResolvedValue({ data: 1 });

  const formattedResults = { 
    _id: 'something',
    requests: ['algo1'],
    results: { algo1: { data: 1 } }, 
    failed: {}, 
    key: password
  };

  const send = jest.fn().mockRejectedValue({ message: 'error' });

  const log = jest.fn();

  await handleResults(send, get, null, password, results, log);

  expect(get).toBeCalledWith('./some/where/');

  expect(send).toBeCalledWith(null, formattedResults);

  expect(log).toBeCalledWith('error');
});


test('test handleResults using default logger function', async() => {
  const results = [ 
                    { _id: 'something',
                      path: './some/where/',
                      request: 'algo1' }
                  ];

  const get = jest.fn().mockResolvedValue({});

  const send = jest.fn().mockRejectedValue({ message: 'error' });

  await handleResults(send, get, null, password, results);

  expect(console.log).toBeCalledWith('error');
});
