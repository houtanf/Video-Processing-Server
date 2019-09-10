const { appendFile } = require('fs');


const logFile = function(filename, msg) {
  const stamp = appendTime(msg);
  appendFile(filename, stamp, e => { 
    if(e)
      console.log(`Issue when logging to file ${filename}:\n ${e.message}\n`);
  });
};


const appendTime = function(msg) {
  const date = new Date();
  const currentDate = 
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return `${msg} ::\t${currentDate}\n`;
};


module.exports = { logFile };
