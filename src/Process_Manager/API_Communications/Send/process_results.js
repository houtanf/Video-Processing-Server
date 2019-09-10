

const handleResults = function(send, get, url, key, results, log=console.log) {
  const collectedData = results.map(fetchResult.bind(null, get, log));
  const msgStruct = { requests: [], results: {}, failed: {} };
  return Promise.all(collectedData)
                .then(data => data.reduce(formatResults, msgStruct))
                .then(data => Object.assign(data, { key }))
                .then(send.bind(null, url))
                .catch(err => log(err.message));
};


const fetchResult = async function(get, log, { _id, path, request, error }) {
  try {
    if (error) throw 'execution error';
    const result = await get(path);
    return { _id, request, result: { [request]: result } };
  }
  catch(e) {
    return handleError(log, _id, request, path, error, e);
  }
};


const formatResults = function(obj, { _id, request, result, failed } ) {
  obj._id = _id;
  obj.requests.push(request);
  if (result)
    obj.results = Object.assign(result, obj.results);
  else
    obj.failed = Object.assign(failed, obj.failed);
  return obj;
};


const handleError = function(log, _id, request, path, msg, err) {
  const failure = { _id, request };
  if (err === 'execution error')
    return Object.assign(failure, { failed: { [request]: msg } });

  const readErr = `Failed to get ${request} results from ${path} for video ${_id}:\n ${err.message}\n`;
  log(readErr);
  return Object.assign(failure, { failed: { [request]: readErr } });
};



module.exports = { handleResults };
