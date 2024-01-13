const { Assets } = require('./Assets');
const { BodyParser } = require('./BodyParser');
const { Compress } = require('./Compress');
const { Cors } = require('./Cors');
const { DynamicRoutes } = require('./DynamicRoutes');
const { Log } = require('./Log');
const { TemplateHandler } = require('./TemplateHandler');

export const middleware = {
  Assets: Assets,
  BodyParser: BodyParser,
  Compress: Compress,
  Cors: Cors,
  DynamicRoutes: DynamicRoutes,
  Log: Log,
  TemplateHandler: TemplateHandler
};
