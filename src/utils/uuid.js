
const uuid = require('node-uuid')

const uuidV1 = function() {
  return uuid.v1()
}

const uuidV4 = function() {
  return uuid.v4()
}

module.exports = {
  uuidV1,
  uuidV4
}
