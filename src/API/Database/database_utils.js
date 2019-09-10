const { ObjectID } = require('mongodb');


const update = function(dbPromise, id, data) {
  return dbPromise.then(db => db.update({ _id: ObjectID(id) }, data));
};


const retrieve = function(dbPromise, query) {
  return dbPromise.then(db => db.find(query).toArray());
};


const findAndUpdate = function(dbPromise, query, update) {
  return dbPromise.then(db => db.findAndModify(query, undefined, update));
};



module.exports = { update, retrieve, findAndUpdate };
