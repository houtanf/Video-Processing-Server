const AWS = require('aws-sdk');


const initS3 = function(configFile) {
  AWS.config.loadFromPath(configFile);
  return new AWS.S3();
};



module.exports = { initS3 };
