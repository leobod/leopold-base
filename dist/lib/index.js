"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const koa_1 = __importDefault(require("koa"));
const path_1 = __importDefault(require("path"));
class Application {
    constructor(config = {}) {
        this.loadConfig(config);
        this.server = new koa_1.default();
        this.server.context.app = this.server.app = this;
        this.server.context.config = this.config;
    }
    loadConfig(config) {
        this.config = config;
        if (!this.config.root) {
            this.config.root = process.cwd();
        }
        if (!this.config.app_path) {
            this.config.app_path = {};
        }
        if (!this.config.app_path.api) {
            this.config.app_path.api = [];
        }
        if (!this.config.app_path.assets) {
            this.config.app_path.assets = path_1.default.join(this.config.root, './assets');
        }
        if (!this.config.app_path.logs) {
            this.config.app_path.logs = path_1.default.join(this.config.root, './logs');
        }
        if (!this.config.app_path.uploads) {
            this.config.app_path.uploads = path_1.default.join(this.config.root, './uploads');
        }
        if (!this.config.app_path.web) {
            this.config.app_path.web = path_1.default.join(this.config.root, './web');
        }
    }
    run() {
        const { port = 8360 } = this.config;
        this.server.listen(port, () => {
            console.log(`http://localhost:${port}`);
        });
    }
}
exports.Application = Application;
