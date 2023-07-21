import Koa from 'koa';
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
declare class Application {
    config: ApplicationConfigType;
    server: Koa;
    constructor(config?: ApplicationConfigType);
    loadConfig(config: ApplicationConfigType): void;
    run(): void;
}
export { Application };
