const sinon = require('sinon');
const fs = require('fs');

const downloadPath = 'some/path/';
const videoInfo = { Bucket: 'some s3 bucket',
                    Key: 'some video key' };
const mockWrite = {
                    write: jest.fn(),
                    end: jest.fn()
                  };

let sandbox;
let getDownload;

beforeEach(() => {
  sandbox = sinon.createSandbox();

  sandbox.stub(fs, 'createWriteStream')
         .withArgs(downloadPath)
         .returns(mockWrite);
  sandbox.stub(fs, 'access')
         .withArgs(downloadPath)
         .callsArgWith(2, true);

  getDownload = require('../../../src/Process_Manager/Video_Downloading/retrieve_video').getDownload;
});

afterEach(() => sandbox.restore());




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

  const returned = await getDownload(s3, videoInfo, downloadPath);

  expect(returned).toMatch('Download Complete');

  expect(s3.getObject).toBeCalledWith(videoInfo);

  expect(s3.on.mock.calls[0][0]).toMatch('error');

  expect(s3.on.mock.calls[1][0]).toMatch('httpData');

  expect(s3.on.mock.calls[2][0]).toMatch('httpDone');

  expect(mockWrite.write).toBeCalled();

  expect(mockWrite.end).toBeCalled();

  expect(s3.send).toBeCalled();
});
