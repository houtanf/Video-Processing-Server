const util = require('util');
const child_process = require('child_process');
const exec = util.promisify(child_process.exec);

const { runAlgos } = require('./execHandlers');
const { process } = require('./processor');


const processManager = function(algos, ...args) {
  const executor = runAlgos.bind(null, algos, exec);
  return process(executor, ...args);
};


module.exports = { processManager };
