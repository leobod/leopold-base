const { routePrefixMather } = require('../dist/utils/routeMatch')

// create a match function from a route
const matcher = routePrefixMather('/api');

console.log(matcher('/api/index'));