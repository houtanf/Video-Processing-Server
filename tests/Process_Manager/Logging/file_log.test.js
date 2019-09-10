const { advanceTo, clear } = require('jest-date-mock');
jest.mock('fs');
console.log = jest.fn();

const { appendFile } = require('fs');

const { logFile } = require('../../../src/Process_Manager/Logging/file_log');

beforeEach(() => {
  advanceTo(new Date(2019, 3, 17, 13, 30, 0));
});


afterEach(() => {
  appendFile.mockReset();
  console.log.mockReset();
});


const error = 'something bad done did';
const file = 'log.txt';
const errorMsg = `${error} ::\t2019-4-17 13:30:0\n`;
consoleErrorObj = { message: 'file error' };
consoleError = `Issue when logging to file ${file}:\n ${consoleErrorObj.message}\n`;


test('test logFile on correct input', () => {
  logFile(file, error);

  expect(appendFile.mock.calls.flat().slice(0,2))
    .toEqual([file, errorMsg]);
});


test('test logFile on file write error', (done) => {
  appendFile.mockImplementationOnce((_, __, func) => {
    func(consoleErrorObj);

    expect(console.log).toBeCalledWith(consoleError);

    done();
  });

  logFile(file, error);
});


test('test logFile file write callback if no error', (done) => {
  appendFile.mockImplementationOnce((_, __, func) => {
    func(null);

    done();
  });

  logFile(file, error);

  expect(appendFile).toBeCalledTimes(1);
});
