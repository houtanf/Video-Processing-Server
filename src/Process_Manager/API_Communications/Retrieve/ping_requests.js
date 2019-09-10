const fetch = require('node-fetch');
const { getRequests } = require('./fetch_requests');


const pingRequests = function(url, callback, sleep=1000, log=console.log, get=fetch) {
  const ping = getRequests.bind(null, url, callback, get, log);
  ping();
  setInterval(ping, sleep);
};



module.exports = { pingRequests };
