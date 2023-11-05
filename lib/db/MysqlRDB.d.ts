export declare class MysqlRDB {
    private config;
    private pool;
    constructor(config?: {});
    /**
     * SQL模板替换
     * @param sql
     * @param params
     * @returns {string}
     */
    formatSql(sql: any, params: any): any;
    /**
     * 模板替换SQL执行
     * @param sql
     * @param values
     * @param isRelease
     * @returns {Promise<unknown>}
     */
    query(sql: any, values: any, isRelease?: boolean): Promise<unknown>;
    /**
     * 存粹SQL执行
     * @param sql
     * @param isRelease
     * @returns {Promise<unknown>}
     */
    pureQuery(sql: any, isRelease?: boolean): Promise<unknown>;
    /**
     * 事务
     * @param tranFn
     * @returns {Promise<unknown>}
     */
    trans(tranFn: any): Promise<unknown>;
}
