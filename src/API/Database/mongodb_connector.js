const { MongoClient } = require('mongodb');

const connect = function (db) {
  return db.db('videos').collection('videos');
};

const establishConnection = function(uri) {
	return MongoClient.connect(uri)
                    .then(connect)
                    .catch((err) => {
                       process.exit(2);
                     });
};


module.exports = { establishConnection };
