jest.mock('fs');
jest.mock('../../../src/Process_Manager/Config_Parsing/parse_jsons');
process.exit = jest.fn();

const {readFileSync, readdirSync } = require('fs');
const { getConfigs }  = require('../../../src/Process_Manager/Config_Parsing/parse_jsons');
const { parseConfigs } = require('../../../src/Process_Manager/Config_Parsing/read_configs');

const path = 'some/path/';
const jsonData = '{ "a": "json" }';
const json = { a: 'json' };


beforeEach(() => {
  readFileSync.mockReset();
  getConfigs.mockReset();
  process.exit.mockReset();
});


test('test parseConfigs executes correctly', () => {
  getConfigs.mockImplementation((p, _, f) => f(p));
  readFileSync.mockReturnValue(jsonData);

  const result = parseConfigs(path);

  expect(result).toEqual(json);

  expect(getConfigs.mock.calls[0].slice(0, 2))
    .toEqual([path, readdirSync]);

  expect(readFileSync).toBeCalledWith(path);
});


test('test parseConfigs handles errors correctly', () => {
  getConfigs.mockImplementation(() => { throw 'oops'; });

  parseConfigs(path);

  expect(process.exit).toBeCalledWith(2);
});
