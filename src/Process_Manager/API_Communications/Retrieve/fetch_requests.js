

const getRequests = function(url, callback, get, log) {
  return get(url).then(handleFetch)
                 .then(callback)
                 .catch(err => log(err.message));
};


const handleFetch = function(response) {
  console.log('Retrieved Requests...');
  if(!response.ok) throw { message: 'Incorrect Response Code' };
  return response.json();
};



module.exports = { getRequests };
