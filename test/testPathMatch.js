const { routePrefixMather } = require('../dist/utils/routeMatch')

// create a match function from a route
const matcher_1 = routePrefixMather('/api');
console.log('/api = ', matcher_1('/api/index'));


// create a match function from a route
const matcher_2 = routePrefixMather('/api/$');
console.log('/api/$ = ', matcher_2('/api/index'));

