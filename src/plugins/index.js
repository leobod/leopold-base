const { Assets } = require('./Assets');
const { DynamicRoutes } = require('./DynamicRoutes');

const plugins = {
  assets: Assets,
  dynamicRoutes: DynamicRoutes
};

module.exports = { plugins };
