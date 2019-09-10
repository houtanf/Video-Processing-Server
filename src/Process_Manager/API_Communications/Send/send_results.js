const fetch = require('node-fetch');
const { promisify } = require('bluebird');
const { readFile } = require('fs');
const readFileAsync = promisify(readFile);


const readResults = function(path, read=readFileAsync) {
  return read(path)
         .then(JSON.parse);
};


const sendResults = async function(url, results, send=fetch) {
  console.log('Sending Results...');
  return await send(url,
                    { method: 'post',
                      body: JSON.stringify(results),
                      headers: { 'Content-Type': 'application/json' },
                    });
};


module.exports = { readResults, sendResults };
