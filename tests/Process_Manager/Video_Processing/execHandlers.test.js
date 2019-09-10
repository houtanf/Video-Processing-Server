const { runAlgos } = require('../../../src/Process_Manager/Video_Processing/execHandlers');
const vidPath = './a/video', savePath = './save/here/video';

test('test runAlgos with correct input', () => {
  const algos = {
    algo0:  jest.fn(() => 'right'),  
    algo1:  jest.fn(() => 'wrong') 
  };

  const execute = jest.fn(() => 'executed');

  const returned = runAlgos(algos, execute, vidPath, savePath, 'algo0');

  expect(returned).toMatch('executed');

  expect(algos.algo0).toBeCalledWith(vidPath, savePath);

  expect(algos.algo1).not.toBeCalled();

  expect(execute).toBeCalledWith('right');
});


test('test runAlgos with other algo called', () => {
  const algos = {
    algo0:  jest.fn(() => 'wrong'),  
    algo1:  jest.fn(() => 'wrong'), 
    algo2:  jest.fn(() => 'right') 
  };

  const execute = jest.fn(() => 'executed');

  const returned = runAlgos(algos, execute, vidPath, savePath, 'algo2');

  expect(returned).toMatch('executed');

  expect(algos.algo2).toBeCalledWith(vidPath, savePath);

  expect(algos.algo0).not.toBeCalled();

  expect(algos.algo1).not.toBeCalled();

  expect(execute).toBeCalledWith('right');
});


test('test runAlgos with execution exception', () => {
  const algos = {
    algo0:  jest.fn(() => 'right'),  
    algo1:  jest.fn(() => 'wrong') 
  };

  const execute = jest.fn(() => { throw 'oops'; });

  const runAlgosExp = runAlgos.bind(null, algos, execute, vidPath, savePath, 'algo0');

  expect(runAlgosExp).toThrow('oops');

  expect(algos.algo0).toBeCalledWith(vidPath, savePath);

  expect(algos.algo1).not.toBeCalled();

  expect(execute).toBeCalledWith('right');
});


test('test runAlgos with algo not found exception', () => {
  const error = { message: 'Algo algo3 not found in algorithm collection' };

  const runAlgosExp = runAlgos.bind(null, {}, null, null, null, 'algo3');

  expect(runAlgosExp).toThrow(error);
});
