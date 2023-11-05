export declare const Log: {
    setLog4js: (mapping?: string) => any;
    /**
     * 加载日志
     * @param app
     * @param server
     * @param config
     * @param enabled
     */
    init: (app: any, server: any, config?: {
        mapping: string;
    }, enabled?: boolean) => void;
};
