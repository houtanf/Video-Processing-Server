const { getDownload } = require('../../../src/Process_Manager/Video_Downloading/retrieve_video');

const videoInfo = { Bucket: 'some s3 bucket',
                    Key: 'some video key' };
const downloadPath = 'some/path/';



test('test getDownload with correct input', async() => {
  const res = { httpResponse: {statusCode: 200} };

  const s3 = {
                getObject: jest.fn().mockReturnThis(),
                on: jest.fn(function(msg, func) {
                  if(msg !== 'error') func(res);
                  return this;
                }),
                send: jest.fn()
             };

  const mockWrite = {
                      write: jest.fn(),
                      end: jest.fn()
                    };

  const write = jest.fn().mockReturnValue(mockWrite);

  const exists = jest.fn((_, __, func) => func(true));

  const returned = await getDownload(s3, videoInfo, downloadPath, write, exists);

  expect(returned).toMatch('Download Complete');

  expect(exists.mock.calls.flat().slice(0, 2))
    .toEqual([downloadPath, undefined]);

  expect(write).toBeCalledWith(downloadPath);

  expect(s3.getObject).toBeCalledWith(videoInfo);

  expect(s3.on.mock.calls[0][0]).toMatch('error');

  expect(s3.on.mock.calls[1][0]).toMatch('httpData');

  expect(s3.on.mock.calls[2][0]).toMatch('httpDone');

  expect(mockWrite.write).toBeCalled();

  expect(mockWrite.end).toBeCalled();

  expect(s3.send).toBeCalled();
});


test('test getDownload when video already exists', async() => {
  const exists = jest.fn((_, __, func) => func(false));

  const s3 = {
                getObject: jest.fn(),
                on: jest.fn(),
                send: jest.fn()
             };

  const mockWrite = {
                      write: jest.fn(),
                      end: jest.fn()
                    };

  const write = jest.fn().mockReturnValue(mockWrite);

  const returned = await getDownload(s3, videoInfo, downloadPath, write, exists);

  expect(returned).toMatch('Video Already Downloaded');

  expect(exists.mock.calls.flat().slice(0, 2))
    .toEqual([downloadPath, undefined]);

  expect(write).not.toBeCalled();

  expect(s3.getObject).not.toBeCalled();

  expect(s3.on).not.toBeCalled();

  expect(mockWrite.write).not.toBeCalled();

  expect(mockWrite.end).not.toBeCalled();

  expect(s3.send).not.toBeCalled();
});


test('test getDownload with video download error', async() => {
  const s3 = {
                getObject: jest.fn().mockReturnThis(),
                on: jest.fn((_,err) => err({ message: 'error' })),
                send: null
             };

  const mockWrite = {
                      write: null,
                      end: jest.fn()
                    };

  const write = jest.fn().mockReturnValue(mockWrite);

  const exists = jest.fn((_, __, func) => func(true));

  try {
    await getDownload(s3, videoInfo, downloadPath, write, exists);
    expect('this expect shouldnt be reached').toMatch('');
  }
  catch(returned) {
    expect(returned).toEqual({ message: 'Downloading Error: error' });
    expect(mockWrite.end).toBeCalled();
  }
});


test('test getDownload with incorrect response code', () => {
  const res = { httpResponse: {
                  statusCode: 404,
                  stream: {statusMessage: 'error'}
                } };

  const s3 = {
                getObject: jest.fn().mockReturnThis(),
                on: jest.fn(function(msg, func) {
                  if(msg !== 'error') func(res);
                  return this;
                }),
                send: jest.fn()
             };

  const mockWrite = {
                      write: jest.fn(),
                      end: jest.fn()
                    };

  const write = jest.fn().mockReturnValue(mockWrite);

  const exists = jest.fn((_, __, func) => func(true));

  const returned = getDownload(s3, videoInfo, downloadPath, write, exists);

  return expect(returned).rejects
    .toEqual({ message: 'Downloading Error: error' });
});


test('test getDownload with path checking error', () => {
  const exists = jest.fn((_, __, func) => { throw 'oops'; });

  const returned = getDownload(null, null, downloadPath, null, exists);

  expect(returned).rejects.toMatch('oops');
});
