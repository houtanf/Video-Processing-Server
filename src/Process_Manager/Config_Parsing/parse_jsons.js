

const getConfigs = function(dir, globber, reader) {
  return findJSONS(dir, globber)
           .flatMap(getJSON.bind(null, reader))
           .reduce(createConfigObject, {});
};


const getJSON = function(reader, path) {
  try {
    return [reader(path)];
  }
  catch(e) {
    return [];
  }
};


const findJSONS = function(dir, globber) {
    const files = globber(dir);
    if(!files.length) throw 'No Config Files Found';
    return files.map(file => `${dir}/${file}`);
};


const createConfigObject = function(obj, { name, command }) {
  return Object.assign({ [name]: makeCaller(command) }, obj);
};


const makeCaller = function(command) {
  return (vid_loc, save_dir) => `${command} ${vid_loc} ${save_dir}`;
};



module.exports = { getConfigs };
