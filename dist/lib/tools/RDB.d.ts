/**
 * 开启pool
 */
declare const pool: any;
declare const RDB: {
    formatSql: (sql: any, params: any) => any;
    query: (sql: any, values: any, isRelease?: boolean) => Promise<unknown>;
    pureQuery: (sql: any, isRelease?: boolean) => Promise<unknown>;
    trans: (tranFn: any) => Promise<unknown>;
    createTable: (sql: any) => Promise<unknown>;
};
export { pool, RDB };
