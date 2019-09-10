

const runAlgos = function(algos, execute, vidPath, resPath, req) {
  const commandGen = algos[req];
  if (!commandGen) 
    throw { message: `Algo ${req} not found in algorithm collection` };
  return execute( commandGen(vidPath, resPath) );
};


module.exports = { runAlgos };
