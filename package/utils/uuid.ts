const uuid = require('uuid');

const uuidV1 = function () {
  return uuid.v1();
};

const uuidV4 = function () {
  return uuid.v4();
};

export { uuidV1, uuidV4 };
