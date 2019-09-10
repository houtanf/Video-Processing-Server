const { curry } = require('lodash');


const process = curry( function(cmdExecutor, vidDownloader, resCallback, logger, vidDir, resDir, data) {
  data.map(download(vidDownloader, vidDir))
      .forEach(execute(cmdExecutor, resCallback, logger, resDir));
});


const download = curry( async function(downloader, dir, { _id, vid_location, requests }) {
  const path = `${dir}/${_id}`;
  try {
    await downloader(vid_location, path);
    return { _id, path, requests };
  }
  catch(e) {
    throw Object.assign(e, { _id, requests, path });
  }
});


const execute = curry( async function(exec, callback, log, dir, vidPromise) {
  try {
    const { _id, requests, path } = await vidPromise;
    const results = requests.map(runRequest(_id, dir, path, exec, log));
    Promise.all(results)
           .then(callback);
  }
  catch(e) {
    const error = `Failed to Download Video ${e._id} to Path ${e.path}:\n ${e.message}\n`;
    log(error);
    sendError(callback, error, e);
  }
});


const runRequest = curry( async function(_id, dir, vidPath, exec, log, request) {
  try {
    const path = `${dir}/${_id}_${request}.json`;
    await exec(vidPath, path, request);
    return { _id, path, request };
  }
  catch(e) {
    const error = `Failed to Execute Algo ${request} on Video ${_id}:\n ${e.message}\n`;
    log(error);
    return { _id, request, error };
  }
});


const sendError = function(callback, error, { _id, requests }) {
  const data = requests.map(request => ({ _id, request, error }));
  return callback(data);
};
  


module.exports = { process };
