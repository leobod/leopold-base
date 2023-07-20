import Koa from 'koa';
import path from 'path';
import { middleware } from './middleware/index';
import { RDB } from './tools/RDB';
import { ResultHandler } from './tools/ResultHandler';
import http from 'http';

interface ApplicationConfigType {
  root?: string;
  port?: number;
  path?: {
    app?: string;
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
    this.server = new Koa();
    this.loadConfig(config);
  }

  loadConfig(config: ApplicationConfigType) {
    this.config = config;
    if (!this.config.root) {
      this.config.root = process.cwd();
    }
    if (!this.config.path || !this.config.path.app) {
      this.config.path.app = path.join(this.config.root, './www');
    }
    if (!this.config.path || !this.config.path.assets) {
      this.config.path.assets = path.join(this.config.root, './assets');
    }

    if (!this.config.path || !this.config.path.logs) {
      this.config.path.logs = path.join(this.config.root, './logs');
    }

    if (!this.config.path || !this.config.path.uploads) {
      this.config.path.uploads = path.join(this.config.root, './uploads');
    }
    if (!this.config.path || !this.config.path.web) {
      this.config.path.web = path.join(this.config.root, './web');
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
