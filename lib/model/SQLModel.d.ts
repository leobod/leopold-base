export declare class SQLModel {
    _table: any;
    _column: {
        [key: string]: {
            type: {
                [key: string]: any;
            };
            allowNull: any;
            autoIncrement: any;
            unique: any;
            primaryKey: any;
            defaultExpr: any;
            comment: any;
        };
    };
    _rules: any;
    _updateRules: any;
    _ref: any;
    _sqlObject: any;
    static PAGE_RULES: {
        page: {
            isPageNum: true;
        };
        size: {
            isPageSize: true;
        };
    };
    constructor(options: any);
    resetSqlObject(): void;
    getCreateTableSql(opt?: {
        force: boolean;
        wrap: boolean;
    }): string;
    getDropTableSql(opt?: {
        force: boolean;
    }): string;
    sql(): any;
    selectOne(fields?: string[]): this;
    select(fields?: string[]): this;
    addCond(cond?: {}, rules?: {}, link?: string): this;
    pageNum(val: any): this;
    pageSize(val: any): this;
    _createExpr(key: any, value: any, rule?: {
        fn?: Function;
        op?: any;
        filterNull?: any;
        filterNullExpr?: any;
    }): any;
    create(obj?: {}, rules?: {}): this;
    update(obj?: {}, rules?: {}): this;
    remove(): this;
    softRemove(obj?: {}, rules?: {}): this;
    count(): this;
    valueOf(): any;
}
