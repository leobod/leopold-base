import Koa from 'koa';
import path from 'path';
import { middleware } from './middleware/index';
import { RDB } from './tools/RDB';
import { ResultHandler } from './tools/ResultHandler';
import http from 'http';

interface ApplicationConfigType {
  root?: string;
  port?: number;
  app_path?: {
    api?: Array<any>;
    assets?: string;
    logs?: string;
    uploads?: string;
    web?: string;
  };
  options?: any;
  middleware?: Array<any>;
}

class Application {
  public config: ApplicationConfigType;
  public server: Koa;

  constructor(config: ApplicationConfigType = {}) {
    this.loadConfig(config);
    this.server = new Koa();
    this.server.context.app = this.server.app = this;
    this.server.context.config = this.config;
  }

  loadConfig(config: ApplicationConfigType) {
    this.config = config;
    if (!this.config.root) {
      this.config.root = process.cwd();
    }
    if (!this.config.app_path) {
      this.config.app_path = {}
    }
    if (!this.config.app_path.api) {
      this.config.app_path.api = []
    }
    if (!this.config.app_path.assets) {
      this.config.app_path.assets = path.join(this.config.root, './assets');
    }
    if (!this.config.app_path.logs) {
      this.config.app_path.logs = path.join(this.config.root, './logs');
    }
    if (!this.config.app_path.uploads) {
      this.config.app_path.uploads = path.join(this.config.root, './uploads');
    }
    if (!this.config.app_path.web) {
      this.config.app_path.web = path.join(this.config.root, './web');
    }
  }

  run() {
    const { port = 8360 } = this.config;
    this.server.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  }
}

export { Application };
