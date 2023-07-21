interface MiddlewareItemType {
    init: (app: any) => void;
}
declare const middleware: {
    name: string;
    handler: MiddlewareItemType;
}[];
export { MiddlewareItemType, middleware };
