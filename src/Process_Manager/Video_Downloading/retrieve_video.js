const { createWriteStream, access } = require('fs');


const getDownload = async function(s3, videoToDownload, pathForDownload, write=createWriteStream, existsChecker=access) {
  if (await videoExists(pathForDownload, existsChecker))
    return Promise.resolve('Video Already Downloaded');
	
  const file = write(pathForDownload);
  return await handleDownload(s3, file, videoToDownload);
};


const videoExists = function(path, exists) {
  const check = (res) => exists(path, undefined, (err) => res(!err));
  return new Promise(check);
};


const handleDownload = function(s3, file, params) {
  errorGen = err => ({ message: `Downloading Error: ${err}` });

  const download = (resolve, reject) => 
    s3.getObject(params)
      .on('error', err => {
        file.end();
        reject( errorGen(err.message) );
      })
      .on('httpData', data => file.write(data))
      .on('httpDone', res => {
        file.end();
        if (res.httpResponse.statusCode < 400)
          return resolve('Download Complete');
        reject( errorGen(res.httpResponse.stream.statusMessage) );
       })
      .send();

  return new Promise(download);
};



module.exports = { getDownload };
