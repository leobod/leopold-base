import path from 'path';
import KoaBody from 'koa-body';
import KoaMount from 'koa-mount';
import KoaStatic from 'koa-static';
import { MiddlewareItemType } from './index';

const BodyParser: MiddlewareItemType = {
  init: function (app): void {
    app.use(
      KoaBody({
        multipart: true,
        formidable: {
          maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
          keepExtensions: true // 保持后缀名
        }
      })
    );

    app.use(
      KoaMount(
        '/assets',
        KoaStatic(path.join(app.$ow.options.ASSETS_PATH), {
          index: false, // 默认为true  访问的文件为index.html  可以修改为别的文件名或者false
          hidden: false, // 是否同意传输隐藏文件
          defer: false // 如果为true，则在返回next()之后进行服务，从而允许后续中间件先进行响应
        })
      )
    );
  }
};

export { BodyParser };
