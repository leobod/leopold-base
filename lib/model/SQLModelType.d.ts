type SQLTypeOptions = {
    name: string;
    cast: string;
    length?: any;
    decimals?: any;
};
declare class SQLType {
    _name: any;
    _cast: any;
    _length: any;
    _decimals: any;
    _options: any;
    constructor(options: SQLTypeOptions);
    toCast(val: any): any;
    toString(): any;
    /**
     * ''+dataType === ''+dataType.valueOf()
     * @returns {*|null}
     */
    valueOf(): string;
}
declare const SQLModelType: {
    VARCHAR: (length?: number) => SQLType;
    TEXT: () => SQLType;
    BOOLEAN: (length?: number) => SQLType;
    INTEGER: () => SQLType;
    BIGINT: () => SQLType;
    FLOAT: (length?: number, decimals?: number) => SQLType;
    DOUBLE: (length?: number, decimals?: number) => SQLType;
    DATETIME: () => SQLType;
};
export { SQLModelType };
