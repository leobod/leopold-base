const { BodyParser } = require('./BodyParser');
const { Compress } = require('./Compress');
const { Cors } = require('./Cors');
const { DynamicParser } = require('./DynamicParser');
const { ErrorHandler } = require('./ErrorHandler');
const { ResultHandler } = require('./ResultHandler');
const { Log4j } = require('./Log4j');
const { TemplateHandler } = require('./TemplateHandler');

const middleware = {
  BodyParser: BodyParser,
  Compress: Compress,
  Cors: Cors,
  DynamicParser: DynamicParser,
  ErrorHandler: ErrorHandler,
  ResultHandler: ResultHandler,
  Log4j: Log4j,
  TemplateHandler: TemplateHandler
};

module.exports = { middleware };
