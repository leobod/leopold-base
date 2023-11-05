declare const SQLObject: {
    getSqlModel: () => {
        query: string;
        tables: never[];
        fields: never[];
        data: never[];
        where: never[];
        append: {
            'GROUP BY': string;
            'ORDER BY': string;
        };
        options: {
            pageNum: null;
            pageSize: null;
        };
    };
    getQsvModel: () => {
        query: string;
        sql: string;
        value: never[];
    };
    toQsv: (model: any) => any[];
    toColumnList: (column?: {}, table?: string) => any[];
};
export { SQLObject };
