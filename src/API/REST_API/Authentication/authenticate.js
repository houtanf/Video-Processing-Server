const crypto = require('crypto');

const hashCompare = function(password, input, algo='sha256') {
  const inputHash = hash(algo, input);
  return password.toUpperCase() === inputHash.toUpperCase();
};

const hash = function(algo, code) {
  const hashAlgo = crypto.createHash(algo);
  hashAlgo.update(code);
  return hashAlgo.digest('hex');
};


module.exports = { hashCompare };
