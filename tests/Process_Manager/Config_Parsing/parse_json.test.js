const { getConfigs } = require('../../../src/Process_Manager/Config_Parsing/parse_jsons');

const dir = '/path/to/configs/', files = ['config.json1', 'config.json2'];

test('test getConfigs with correct input', () => {
  const globber = jest.fn(() => files);

  const configObj1 = {
                      name: 'algo1',
                      command: 'docker run process1'
                    };

  const configObj2 = {
                      name: 'algo2',
                      command: 'docker run process2'
                    };

  const algos = {
                  algo2: (a, b) => `docker run process2 ${a} ${b}`,
                  algo1: (a, b) => `docker run process1 ${a} ${b}`
                };

  const mockReader = (file) => (file.slice(-1) === '1') ? configObj1 : configObj2;

  const reader = jest.fn(mockReader);

  const returned = getConfigs(dir, globber, reader);

  expect(globber).toBeCalledWith(dir);

  expect(reader.mock.calls.flat())
    .toEqual(files.map(file => `${dir}/${file}`));

  expect(Object.keys(returned)).toEqual(Object.keys(algos));

  expect(returned.algo1('vidPath', 'storeHere'))
      .toMatch(algos.algo1('vidPath', 'storeHere'));

  expect(returned.algo2('vidPath', 'storeHere'))
      .toMatch(algos.algo2('vidPath', 'storeHere'));
});


test('test getConfigs with no config files found', () => {
  const globber = jest.fn(() => []);

  const reader = jest.fn();

  const getConfigExp = getConfigs.bind(null, dir, globber, reader);

  expect(getConfigExp).toThrow('No Config Files Found');

  expect(globber).toBeCalledWith(dir);

  expect(reader).not.toBeCalled();
});


test('test getConfigs with read exceptions on all files', () => {
  const globber = jest.fn(() => files);

  const reader = jest.fn(() => { throw 'error'; });

  const returned = getConfigs(dir, globber, reader);

  expect(returned).toEqual({});

  expect(globber).toBeCalledWith(dir);

  expect(reader.mock.calls.flat())
    .toEqual(files.map(file => `${dir}/${file}`));
});


test('test getConfigs with read exception on some files', () => {
  const globber = jest.fn(() => files);

  const configObj = {
                      name: 'algo1',
                      command: 'docker run process1'
                    };
  const algos = {
                  algo1: (a, b) => `docker run process1 ${a} ${b}`
                };

  const mockReader = (file) => {
    if(file.slice(-1) === '1')
      return configObj;
    throw 'error';
  };

  const reader = jest.fn(mockReader);

  const returned = getConfigs(dir, globber, reader);

  expect(globber).toBeCalledWith(dir);

  expect(reader.mock.calls.flat())
    .toEqual(files.map(file => `${dir}/${file}`));

  expect(Object.keys(returned)).toEqual(Object.keys(algos));

  expect(returned.algo1('vidPath', 'storeHere'))
      .toMatch(algos.algo1('vidPath', 'storeHere'));
});
