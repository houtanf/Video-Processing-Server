const { curry } = require('lodash');

const handleRequest = curry( async function(submitter, callbacks, req, res) {
  try {
    const response = await submitter(req.body, callbacks);
    res.status(200).send(response);
  }
  catch(e) {
    const code = e.type === 'Client Error' ? 400 : 500;
    res.status(code).send(e.message);
  }
});


const handleClientError = function(err, req, res, next) {
  if(!err) return next();
  res.sendStatus(400);
};


const handleAuthentication = curry( function(authenticate, req, res, next) {
  try{
    const access = authenticate(req.body.key);
    if(access) return next();
    throw 'unauthroized';
  }
  catch(e) {
    res.sendStatus(401);
  }
});


module.exports = { handleRequest, handleClientError, handleAuthentication };
