const { process } = require('../../../src/Process_Manager/Video_Processing/processor');

const vidDir = './save/vid/here/';
const resDir = './save/results/here';

const videoRequestOneAlgorithm = {
  _id: 123,
  requests: ['algo1'],
  vid_location: 'video info',
};

const pathVidSavedTo = `${vidDir}/${videoRequestOneAlgorithm._id}`;
const pathResSavedTo = `${resDir}/${videoRequestOneAlgorithm._id}_algo1.json`;
const videoRequestOneAlgorithmData = [videoRequestOneAlgorithm];

const videoRequestTwoAlgorithms = {
  _id: 456,
  requests: ['algo1', 'algo2'],
  vid_location: 'video info',
};

const pathVidSavedToTwoAlgorithms = `${vidDir}/${videoRequestTwoAlgorithms._id}`;
const pathAlgo1SavedTo = `${resDir}/${videoRequestTwoAlgorithms._id}_algo1.json`;
const pathAlgo2SavedTo = `${resDir}/${videoRequestTwoAlgorithms._id}_algo2.json`;
const vidError = `Failed to Download Video ${videoRequestTwoAlgorithms._id} to Path ${pathVidSavedToTwoAlgorithms}:\n error\n`;
const algo1Error = `Failed to Execute Algo algo1 on Video ${videoRequestTwoAlgorithms._id}:\n error\n`;
const algo2Error = `Failed to Execute Algo algo2 on Video ${videoRequestTwoAlgorithms._id}:\n error\n`;
const videoRequestTwoAlgorithmsData = [videoRequestTwoAlgorithms];

const resultsTwoAlgorithms = [
  {
    _id: videoRequestTwoAlgorithms._id,
    request: 'algo1',
    path: pathAlgo1SavedTo
  },
  {
    _id: videoRequestTwoAlgorithms._id,
    request: 'algo2',
    path: pathAlgo2SavedTo
  }
];

const resultsTwoAlgorithmsError = [
  {
    _id: videoRequestTwoAlgorithms._id,
    request: 'algo1',
    error: vidError
  },
  {
    _id: videoRequestTwoAlgorithms._id,
    request: 'algo2',
    error: vidError
  }
];

const vid_request1 = {
  _id: 123,
  requests: ['algo1'],
  vid_location: 'vid 1 info',
};

const vid_request2 = {
  _id: 456,
  requests: ['algo2'],
  vid_location: 'another video info',
};

const pathVid1SavedTo = `${vidDir}/${vid_request1._id}`;
const pathVid2SavedTo = `${vidDir}/${vid_request2._id}`;
const pathRes1SavedTo = `${resDir}/${vid_request1._id}_algo1.json`;
const pathRes2SavedTo = `${resDir}/${vid_request2._id}_algo2.json`;

const vidDownloader = jest.fn(() => Promise.resolve());
const cmdExecutor = jest.fn(() => Promise.resolve());
const vidDownloaderWithError = jest.fn().mockRejectedValue({ message: 'error' });
const log = jest.fn();

test('test process with one video request with one algo', (done) => {
  const resultsOneAlgorithm = [{
    _id: videoRequestOneAlgorithm._id,
    request: 'algo1',
    path: pathResSavedTo
  }];
  const callback = (arg) => {
    expect(vidDownloader).toBeCalledWith(videoRequestOneAlgorithm.vid_location, pathVidSavedTo);
    expect(cmdExecutor).toBeCalledWith(pathVidSavedTo, pathResSavedTo, 'algo1');
    expect(arg).toEqual(resultsOneAlgorithm);
    done();
  };

  process(cmdExecutor, vidDownloader, callback, null, vidDir, resDir, videoRequestOneAlgorithmData);
});

test('test process with one video request with multiple algos', (done) => {
  const callback = (arg) => {
    expect(vidDownloader).toBeCalledWith(videoRequestTwoAlgorithms.vid_location, pathVidSavedToTwoAlgorithms);
    expect(cmdExecutor).toBeCalledWith(pathVidSavedToTwoAlgorithms, pathAlgo1SavedTo, 'algo1');
    expect(cmdExecutor).toBeCalledWith(pathVidSavedToTwoAlgorithms, pathAlgo2SavedTo, 'algo2');
    expect(arg).toEqual(resultsTwoAlgorithms);
    done();
  };

  process(cmdExecutor, vidDownloader, callback, null, vidDir, resDir, videoRequestTwoAlgorithmsData);
});

test('test process with one video request where all algos fail to download', (done) => {
  const callback = (arg) => {
    expect(vidDownloaderWithError).toBeCalledWith(videoRequestTwoAlgorithms.vid_location, pathVidSavedToTwoAlgorithms);
    expect(log).toBeCalledWith(vidError);
    expect(arg).toEqual(resultsTwoAlgorithmsError);
    done();
  };

  process(null, vidDownloaderWithError, callback, log, vidDir, resDir, videoRequestTwoAlgorithmsData);
});

test('test process with one video request where all algos fail execution', (done) => {
  const cmdExecutor = jest.fn().mockRejectedValue({ message: 'error' });
  const results = [
    {
      _id: videoRequestTwoAlgorithms._id,
      request: 'algo1',
      error: algo1Error
    },
    {
      _id: videoRequestTwoAlgorithms._id,
      request: 'algo2',
      error: algo2Error
    }
  ];

  const callback = (arg) => {
    expect(vidDownloader).toBeCalledWith(videoRequestTwoAlgorithms.vid_location, pathVidSavedToTwoAlgorithms);
    expect(cmdExecutor).toBeCalledWith(pathVidSavedToTwoAlgorithms, pathAlgo1SavedTo, 'algo1');
    expect(cmdExecutor).toBeCalledWith(pathVidSavedToTwoAlgorithms, pathAlgo2SavedTo, 'algo2');
    expect(log).toBeCalledWith(algo1Error);
    expect(log).toBeCalledWith(algo2Error);
    expect(arg).toEqual(results);
    done();
  };

  process(cmdExecutor, vidDownloader, callback, log, vidDir, resDir, videoRequestTwoAlgorithmsData);
});

test('test process with one video request where some algos fail execution', (done) => {
  const results = [
    {
      _id: videoRequestTwoAlgorithms._id,
      request: 'algo1',
      path: pathAlgo1SavedTo
    },
    {
      _id: videoRequestTwoAlgorithms._id,
      request: 'algo2',
      error: algo2Error
    }
  ];

  const cmdExecutor = jest.fn()
    .mockResolvedValueOnce()
    .mockRejectedValueOnce({ message: 'error' });

  const callback = (arg) => {
    expect(vidDownloader).toBeCalledWith(videoRequestTwoAlgorithms.vid_location, pathVidSavedToTwoAlgorithms);
    expect(cmdExecutor).toBeCalledWith(pathVidSavedToTwoAlgorithms, pathAlgo1SavedTo, 'algo1');
    expect(cmdExecutor).toBeCalledWith(pathVidSavedToTwoAlgorithms, pathAlgo2SavedTo, 'algo2');
    expect(log).toBeCalledWith(algo2Error);
    expect(arg).toEqual(results);
    done();
  };

  process(cmdExecutor, vidDownloader, callback, log, vidDir, resDir, videoRequestTwoAlgorithmsData);
});

test('test process with multiple video requests each with one unique algo', (done) => {
  const results1 = [{
    _id: vid_request1._id,
    request: 'algo1',
    path: pathRes1SavedTo
  }];

  const results2 = [{
    _id: vid_request2._id,
    request: 'algo2',
    path: pathRes2SavedTo
  }];

  const data = [vid_request1, vid_request2];
  let iteration = 0;

  const callback = (arg) => {
    iteration += 1;
    if (iteration === 1) {
      expect(vidDownloader).toBeCalledWith(vid_request1.vid_location, pathVid1SavedTo);
      expect(cmdExecutor).toBeCalledWith(pathVid1SavedTo, pathRes1SavedTo, 'algo1');
      expect(arg).toEqual(results1);
    }
    else {
      expect(vidDownloader).toBeCalledWith(vid_request2.vid_location, pathVid2SavedTo);
      expect(cmdExecutor).toBeCalledWith(pathVid2SavedTo, pathRes2SavedTo, 'algo2');
      expect(arg).toEqual(results2);
      done();
    }
  };

  process(cmdExecutor, vidDownloader, callback, null, vidDir, resDir, data);
});

test('test process with multiple video requests with multiple algos', (done) => {
  const vid_request1 = {
    _id: 123,
    requests: ['algo1', 'algo2'],
    vid_location: 'vid 1 info',
  };

  const vid_request2 = {
    _id: 456,
    requests: ['algo3', 'algo4'],
    vid_location: 'another video info',
  };

  const data = [vid_request1, vid_request2];
  const pathVid1SavedTo = `${vidDir}/${vid_request1._id}`;
  const pathVid2SavedTo = `${vidDir}/${vid_request2._id}`;
  const pathRes1Algo1SavedTo = `${resDir}/${vid_request1._id}_algo1.json`;
  const pathRes1Algo2SavedTo = `${resDir}/${vid_request1._id}_algo2.json`;
  const pathRes2Algo3SavedTo = `${resDir}/${vid_request2._id}_algo3.json`;
  const pathRes2Algo4SavedTo = `${resDir}/${vid_request2._id}_algo4.json`;

  const results1 = [
    {
      _id: vid_request1._id,
      request: 'algo1',
      path: pathRes1Algo1SavedTo
    },
    {
      _id: vid_request1._id,
      request: 'algo2',
      path: pathRes1Algo2SavedTo
    }
  ];

  const results2 = [
    {
      _id: vid_request2._id,
      request: 'algo3',
      path: pathRes2Algo3SavedTo
    },
    {
      _id: vid_request2._id,
      request: 'algo4',
      path: pathRes2Algo4SavedTo
    }
  ];

  let iteration = 0;

  const callback = (arg) => {
    iteration += 1;

    if (iteration === 1) {
      expect(vidDownloader).toBeCalledWith(vid_request1.vid_location, pathVid1SavedTo);
      expect(cmdExecutor).toBeCalledWith(pathVid1SavedTo, pathRes1Algo1SavedTo, 'algo1');
      expect(cmdExecutor).toBeCalledWith(pathVid1SavedTo, pathRes1Algo2SavedTo, 'algo2');
      expect(arg).toEqual(results1);
    }
    else {
      expect(vidDownloader).toBeCalledWith(vid_request2.vid_location, pathVid2SavedTo);
      expect(cmdExecutor).toBeCalledWith(pathVid2SavedTo, pathRes2Algo3SavedTo, 'algo3');
      expect(cmdExecutor).toBeCalledWith(pathVid2SavedTo, pathRes2Algo4SavedTo, 'algo4');
      expect(arg).toEqual(results2);
      done();
    }
  };

  process(cmdExecutor, vidDownloader, callback, null, vidDir, resDir, data);
});

test('test process with multiple video requests with multiple algos where some algos in one video fail', (done) => {
  const multipleVideosMultipleAlgorithms1 = {
    _id: 123,
    requests: ['algo1', 'algo2'],
    vid_location: 'vid 1 info',
  };

  const multipleVideosMultipleAlgorithms2 = {
    _id: 456,
    requests: ['algo3', 'algo4'],
    vid_location: 'another video info',
  };

  const data = [multipleVideosMultipleAlgorithms1, multipleVideosMultipleAlgorithms2];
  const pathVid1SavedTo = `${vidDir}/${multipleVideosMultipleAlgorithms1._id}`;
  const pathVid2SavedTo = `${vidDir}/${multipleVideosMultipleAlgorithms2._id}`;
  const pathRes1Algo1SavedTo = `${resDir}/${multipleVideosMultipleAlgorithms1._id}_algo1.json`;
  const pathRes1Algo2SavedTo = `${resDir}/${multipleVideosMultipleAlgorithms1._id}_algo2.json`;
  const pathRes2Algo3SavedTo = `${resDir}/${multipleVideosMultipleAlgorithms2._id}_algo3.json`;
  const pathRes2Algo4SavedTo = `${resDir}/${multipleVideosMultipleAlgorithms2._id}_algo4.json`;
  const algo4Error = `Failed to Execute Algo algo4 on Video ${multipleVideosMultipleAlgorithms2._id}:\n error\n`;

  const results1 = [
    {
      _id: multipleVideosMultipleAlgorithms1._id,
      request: 'algo1',
      path: pathRes1Algo1SavedTo
    },
    {
      _id: multipleVideosMultipleAlgorithms1._id,
      request: 'algo2',
      path: pathRes1Algo2SavedTo
    }
  ];

  const results2 = [
    {
      _id: multipleVideosMultipleAlgorithms2._id,
      request: 'algo3',
      path: pathRes2Algo3SavedTo
    },
    {
      _id: multipleVideosMultipleAlgorithms2._id,
      request: 'algo4',
      error: algo4Error
    }
  ];

  const mockExecutor = (_, __, algo) => (algo === 'algo4') ? Promise.reject({ message: 'error' }) : Promise.resolve();
  const cmdExecutor = jest.fn(mockExecutor);

  let iteration = 0;

  const callback = (arg) => {
    iteration += 1;

    if (iteration === 1) {
      expect(vidDownloader).toBeCalledWith(multipleVideosMultipleAlgorithms1.vid_location, pathVid1SavedTo);
      expect(cmdExecutor).toBeCalledWith(pathVid1SavedTo, pathRes1Algo1SavedTo, 'algo1');
      expect(cmdExecutor).toBeCalledWith(pathVid1SavedTo, pathRes1Algo2SavedTo, 'algo2');
      expect(arg).toEqual(results1);
    }
    else {
      expect(vidDownloader).toBeCalledWith(multipleVideosMultipleAlgorithms2.vid_location, pathVid2SavedTo);
      expect(cmdExecutor).toBeCalledWith(pathVid2SavedTo, pathRes2Algo3SavedTo, 'algo3');
      expect(cmdExecutor).toBeCalledWith(pathVid2SavedTo, pathRes2Algo4SavedTo, 'algo4');
      expect(log).toBeCalledWith(algo4Error);
      expect(arg).toEqual(results2);
      done();
    }
  };

  process(cmdExecutor, vidDownloader, callback, log, vidDir, resDir, data);
});