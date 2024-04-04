const { Assets } = require('./Assets');
const { BodyParser } = require('./BodyParser');
const { Compress } = require('./Compress');
const { Cors } = require('./Cors');
const { DynamicRoutes } = require('./DynamicRoutes');
const { TemplateHandler } = require('./TemplateHandler');

export const middleware = {
  Cors: Cors,
  BodyParser: BodyParser,
  Compress: Compress,
  Assets: Assets,
  TemplateHandler: TemplateHandler,
  DynamicRoutes: DynamicRoutes,
};
