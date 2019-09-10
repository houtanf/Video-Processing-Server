jest.mock('aws-sdk');

const AWS = require('aws-sdk');
const { initS3 } = require('../../../src/Process_Manager/Video_Downloading/init_s3');


const config = 'some/path/';

afterEach(() => {
  AWS.config.loadFromPath.mockReset();
  AWS.S3.mockReset();
});



test('test initS3 for correct execution', () => {
  AWS.S3.mockReturnValue({ res: 'yay' });

  const result = initS3(config);

  expect(AWS.config.loadFromPath).toBeCalledWith(config);

  expect(AWS.S3).toHaveBeenCalledTimes(1);

  expect(result).not.toEqual(null);
});
