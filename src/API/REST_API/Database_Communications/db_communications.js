const _ = require('lodash');


const updateResults = async function(body, dbCallers) {
  checkRequest(body);
  const updatedData = await format(body);
  return await dbInteraction(updatedData, dbCallers);
};


const dbInteraction = async function(data, dbCallers) {
  try {
    return await submit(data, dbCallers.update);
  }
  catch(e) {
    if(e.code === 2) {
      e.message = 'Incorrect Request Format (Incorrect Value Types)';
      e.type = 'Client Error';
    }
    throw e;
  }
};


const checkRequest = function(body) {
  const required = ['_id', 'requests', 'results', 'failed'];
  const checker = field => field in body;
  if( !required.every(checker) )
    throw { type: 'Client Error', message: 'Incorrect Request Format (Missing Fields)' };
};


const format = async function({_id, requests, results: oldRes, failed: err}) {
  const results = Object.keys(oldRes)
                        .reduce(rename.bind(null, 'results', oldRes), {});
  const failed = Object.keys(err)
                       .reduce(rename.bind(null, 'failed', err), {});
  return { _id, requests, results, failed };
};

const rename = function(field, oldObj, obj, name) {
    obj[`${field}.${name}`] = oldObj[name];
    return obj;
};

  
const submit = async function({ _id, requests, results, failed }, dbCaller) {
  const update = { 
    $pullAll: { pending: requests },
    $set: Object.assign(results, failed)
  };
  const success = await dbCaller(_id, update);
  if(success.result.n < 1) 
    throw { type: 'Client Error', message: 'Id not found.' };
  return 'Results Successfully Submitted.';
};



const getPending = async function(_, dbCallers) {
  return makeRequests(dbCallers, []);
};


const makeRequests = async function(dbCallers, requests) {
  try {
    const response = await dbCallers.findAndUpdate({ requests: { $exists: true, $ne: [] } },
                                                   { $set: { requests : [] } });
    const vid = response.value;
    if(!vid) throw 'no more requests';
    requests.push(vid);
    await dbCallers.update(vid._id, { $push: { pending : { $each: vid.requests } } });
    return await makeRequests(dbCallers, requests);
  }
  catch(e) {
    return requests;
  }
};


module.exports = { updateResults, getPending };
