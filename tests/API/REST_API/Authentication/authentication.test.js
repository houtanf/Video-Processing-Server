const { hashCompare } = require('../../../../src/API/REST_API/Authentication/authenticate.js');

const password = 'thisisabadpassword';
const passHash = '95ca395ead5bff48f92dc516287a31331c854a918017270b321482d2424edd38';


test('test hashCompare with correct password', () => {
  const access = hashCompare(passHash, password);

  expect(access).toBeTruthy();
});


test('test hashCompare with incorrect password', () => {
  const access = hashCompare(passHash, 'wrong');

  expect(access).not.toBeTruthy();
});


test('test hashCompare with uppercase hash (shouldnt make a difference)', () => {
  const access = hashCompare(passHash.toUpperCase(), password);

  expect(access).toBeTruthy();
});


test('test hashCompare with non-default hash algo', () => {
  const md5Hash = '3873EE062E7C5FBB0F626FFCAE675FC0';

  const access = hashCompare(md5Hash, password, 'md5');

  expect(access).toBeTruthy();
});
