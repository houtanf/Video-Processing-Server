const { readFileSync, readdirSync } = require('fs');

const { getConfigs } = require('./parse_jsons');


const parseConfigs = function(dir) {
  try {
    return getConfigs(dir, readdirSync, readJSONSync);
  }
  catch(e) {
    process.exit(2);
  }
};

const readJSONSync = path =>
  JSON.parse( readFileSync(path) );



module.exports = { parseConfigs };
