const sinon = require('sinon');
const util = require('util');
const { exec } = require('child_process');

const processor = require('../../../src/Process_Manager/Video_Processing/processor');
const mockProcessor = jest.fn((exe) => exe('NA', 'NA', 'algo1'));
const mockExe = jest.fn(() => 'yay');
let sandbox;
let processManager;


beforeEach(() => {
  sandbox = sinon.createSandbox();

  sandbox.stub(util, 'promisify')
         .withArgs(exec)
         .returns(mockExe);
  sandbox.stub(processor, 'process')
         .callsFake(mockProcessor);

  processManager = require('../../../src/Process_Manager/Video_Processing/process_manager').processManager;
});

afterEach(() => sandbox.restore());


test('test processManager with correct input', () => {
  const algosObj = {
          algo1: () => 'command'
  };

  const returned = processManager(algosObj);

  expect(returned).toMatch('yay');

  expect(mockProcessor).toBeCalled();

  expect(mockExe).toBeCalledWith('command');
});
