"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const http_1 = __importDefault(require("http"));
const koa_1 = __importDefault(require("koa"));
const path_1 = __importDefault(require("path"));
const MysqlRDB_1 = require("../db/MysqlRDB");
const Result_1 = require("../tools/Result");
const middleware_1 = require("../middleware");
const obj_1 = require("../utils/obj");
const templateConfig = require('../leopold.template.config');
/**
 * 应用程序
 * @type {Application}
 */
class Application {
    /**
     * 初始化参数
     */
    initConfig(config = { path: '' }) {
        this.config = Object.assign({}, templateConfig, config);
        this.config.path = path_1.default.join(process.cwd(), config.path);
    }
    /**
     * 加载工具
     */
    initTools() {
        if (!this.Result) {
            this.Result = Result_1.Result;
        }
        this.server.use((ctx, next) => __awaiter(this, void 0, void 0, function* () {
            ctx.$root = this;
            yield next();
        }));
    }
    /**
     * 加载数据连接工具
     */
    initDB() {
        /* 注册数据库工具 */
        this.DB = {};
        if (!(0, obj_1.isEmpty)(this.config['DB'])) {
            for (const key in this.config['DB']) {
                const item = this.config['DB'][key];
                if (item.type === 'MYSQL' && !(0, obj_1.isEmpty)(item.config)) {
                    this.DB[key] = new MysqlRDB_1.MysqlRDB(item.config);
                }
            }
        }
    }
    /**
     * 加载中间件,默认加载的
     */
    initMiddlewares() {
        if (!(0, obj_1.isEmpty)(this.config['Middlewares'])) {
            const Middlewares = this.config['Middlewares'];
            for (const key in Middlewares) {
                if (middleware_1.middleware[key] && Middlewares[key].enabled) {
                    middleware_1.middleware[key].init(this, this.server, Middlewares[key].config, Middlewares[key].enabled);
                }
            }
        }
    }
    /**
     * 加载插件,可自定义的
     */
    initPlugins() {
        if (!(0, obj_1.isEmpty)(this.config['Plugins'])) {
            const Plugins = this.config['Plugins'];
            for (const key in Plugins) {
                try {
                    Plugins[key].init(this, this.server, Plugins[key].config);
                }
                catch (e) {
                    console.warn(e);
                }
            }
        }
    }
    /**
     * 启动应用程序
     * @param port
     */
    start(port = 8360) {
        let applicationPort = port;
        if (!port) {
            const { port = 8360 } = this.config;
            applicationPort = port;
        }
        this.config.port = applicationPort;
        this.server.listen(applicationPort, () => {
            console.log(`http://localhost:${applicationPort}`);
        });
    }
    constructor(config) {
        this.initConfig(config);
        const server = new koa_1.default();
        const wrapper = http_1.default.createServer(server.callback()); /* koa脚手架创建的服务器 */
        this.server = server;
        this.server.$wrapper = wrapper;
        this.server.$root = this;
        this.initTools();
        this.initDB();
        this.initMiddlewares();
        this.initPlugins();
    }
}
exports.Application = Application;
