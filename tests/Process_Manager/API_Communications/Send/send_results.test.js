const { readResults, sendResults } = require('../../../../src/Process_Manager/API_Communications/Send/send_results');
const path = './some/where/';

test('readResults with correct input', () => {
  const jsonString = '{ "data": 1 }';

  const jsonParsed = { data: 1 };

  const read = jest.fn(() => Promise.resolve(jsonString));

  const data = readResults(path, read);

  expect(read).toBeCalledWith(path);

  return expect(data).resolves.toEqual(jsonParsed);
});


test('readResults with read exception', () => {
  const read = jest.fn(() => Promise.reject('error'));

  const data = readResults(null, read);

  expect(read).toBeCalledWith(null);

  return expect(data).rejects.toMatch('error');
});


test('readResults with json parse exception', () => {
  const read = jest.fn(() => Promise.resolve(''));

  const data = readResults(path, read);

  expect(read).toBeCalledWith(path);

  return expect(data).rejects.toThrow();
});




test('sendResults with correct input', async() => {
  const url = 'something.com';

  const results = { data: 1 };

  const send = jest.fn(() => Promise.resolve('yay'));

  const options = { 
                     method: 'post',
                     body: '{"data":1}', 
                     headers: { 'Content-Type': 'application/json' }
                  };

  await sendResults(url, results, send);

  expect(send).toBeCalledWith(url, options);
});


test('sendResults with send exception', () => {
  const send = jest.fn(() => Promise.reject('error'));

  const response = sendResults(null, null, send);

  return expect(response).rejects.toMatch('error');
});


test('sendResults with json stringify exception', () => {
  const response = sendResults(null, 5, null);

  return expect(response).rejects.toThrow();
});
