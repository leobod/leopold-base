const { Assets } = require('./Assets');
const { BodyParser } = require('./BodyParser');
const { Compress } = require('./Compress');
const { Cors } = require('./Cors');
const { DynamicRoutes } = require('./DynamicRoutes');
const { Log } = require('./Log');
const { TemplateHandler } = require('./TemplateHandler');

export const middleware = {
  Log: Log,
  Cors: Cors,
  BodyParser: BodyParser,
  Compress: Compress,
  Assets: Assets,
  TemplateHandler: TemplateHandler,
  DynamicRoutes: DynamicRoutes,
};
