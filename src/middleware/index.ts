interface MiddlewareItemType {
  init: (app) => void;
}

import { BodyParser } from './BodyParser';
import { Cors } from './Cors';
import { ErrorHandler } from './ErrorHandler';
import { TemplateHandler } from './TemplateHandler';
import { Log4j } from './Log4j';

const middleware = [
  { name: 'BodyParser', handler: BodyParser },
  { name: 'Cors', handler: Cors },
  { name: 'ErrorHandler', handler: ErrorHandler },
  { name: 'TemplateHandler', handler: TemplateHandler },
  { name: 'Log4j', handler: Log4j }
];

export {
  MiddlewareItemType,
  middleware
}
