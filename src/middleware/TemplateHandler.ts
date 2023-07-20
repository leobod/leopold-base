import KoaView from "koa-view";
import { MiddlewareItemType } from './index';

const TemplateHandler: MiddlewareItemType = {
  init: function (app) {
    // Must be used before any router is used
    app.use(KoaView(app.$ow.options.WEB_PATH));
  }
};

export { TemplateHandler };
