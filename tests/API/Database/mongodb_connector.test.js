jest.mock('mongodb');
process.exit = jest.fn();

const { MongoClient } = require('mongodb');
const { establishConnection } = require('../../../src/API/Database/mongodb_connector');


const uri = 'something.com';
const dbObj = { 
  db: jest.fn(),
  collection: jest.fn()
};


afterEach(() => {
  MongoClient.connect.mockReset();
  dbObj.db.mockReset();
  dbObj.collection.mockReset();
  process.exit.mockReset();
});


test('test establishConnection has correct execution', async() => {
  MongoClient.connect.mockResolvedValue(dbObj);

  dbObj.db.mockReturnThis();
  dbObj.collection.mockReturnValue('yay');

  const result = await establishConnection(uri);

  expect(result).toMatch('yay');

  expect(MongoClient.connect).toBeCalledWith(uri);

  expect(dbObj.db).toBeCalledWith('videos');

  expect(dbObj.collection).toBeCalledWith('videos');
});


test('test establishConnection with connection faliure', (done) => {
  MongoClient.connect.mockRejectedValue('oh no');

  process.exit.mockImplementation(code => {
    expect(code).toBe(2);
    done();
  });

  const result = establishConnection(uri);
});
