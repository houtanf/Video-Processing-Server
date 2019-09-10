const utils = require('../../../src/API/Database/database_utils');
const { ObjectID } = require('mongodb');


test('test update with correct input', async() => {
  const id = '5c5b6b5a1c9d44000048b923';

  const objID = ObjectID(id);
  //const mockObjectID = jest.fn(() => 'new id');

  const db = { update: jest.fn(() => 'success') };

  const dbPromise = Promise.resolve(db);

  const data = { video: 'a cool vid' };

  const results = await utils.update(dbPromise, id, data);

  expect(results).toMatch('success');

  expect(db.update).toBeCalledWith({ _id: objID }, data);

  //expect(mockObjectID).toBeCalledWith(id);
});


test('test update on database exception', () => {
  const dbPromise = Promise.reject('error');

  return expect(utils.update(dbPromise, null, null, null)).rejects.toMatch('error');
});


test('test retrieve with correct input', async() =>{
  const arrayObj = { toArray: jest.fn(() => 'success') };

  const db = { find: jest.fn(() => arrayObj) };

  const dbPromise = Promise.resolve(db);

  const query = 'some query';

  const results = await utils.retrieve(dbPromise, query);

  expect(results).toMatch('success');

  expect(db.find).toBeCalledWith(query);

  expect(arrayObj.toArray).toBeCalled();
});


test('test retrieve on database exception', () => {
  const dbPromise = Promise.reject('error');

  return expect(utils.retrieve(dbPromise, null)).rejects.toMatch('error');
});


test('test findAndUpdate with correct input', async() => {
  const db = {findAndModify: jest.fn(()=> 'success')};

  const dbPromise = Promise.resolve(db);

  const query = { someField: 'some query obj' };

  const update = { $set: 'some update query obj' };

  const results = await utils.findAndUpdate(dbPromise, query, update);

  expect(results).toMatch('success');

  expect(db.findAndModify).toBeCalledWith(query, undefined, update);
});


test('test findAndUpdate on database exception', () => {
  const dbPromise = Promise.reject('error');

  return expect(utils.findAndUpdate(dbPromise)).rejects.toMatch('error');
});
