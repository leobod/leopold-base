/**
 * 应用程序
 * @type {Application}
 */
export declare class Application {
    config: any;
    server: any;
    Result: any;
    DB: any;
    /**
     * 初始化参数
     */
    initConfig(config?: {
        path: string;
    }): void;
    /**
     * 加载工具
     */
    initTools(): void;
    /**
     * 加载数据连接工具
     */
    initDB(): void;
    /**
     * 加载中间件,默认加载的
     */
    initMiddlewares(): void;
    /**
     * 加载插件,可自定义的
     */
    initPlugins(): void;
    /**
     * 启动应用程序
     * @param port
     */
    start(port?: number): void;
    constructor(config: any);
}
