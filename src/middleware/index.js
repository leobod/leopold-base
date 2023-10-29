const { BodyParser } = require('./BodyParser');
const { Compress } = require('./Compress');
const { Cors } = require('./Cors');
const { ErrorHandler } = require('./ErrorHandler');
const { TemplateHandler } = require('./TemplateHandler');

const middleware = {
  BodyParser: BodyParser,
  Compress: Compress,
  Cors: Cors,
  ErrorHandler: ErrorHandler,
  TemplateHandler: TemplateHandler
};

module.exports = { middleware };
