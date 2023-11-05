export let path: string;
export let port: number;
export let DB: {};
export namespace Middlewares {
    namespace Assets {
        let enabled: boolean;
        namespace config {
            let path_1: string;
            export { path_1 as path };
            export let mapping: string;
            export namespace opts {
                let index: boolean;
                let hidden: boolean;
                let defer: boolean;
            }
        }
    }
    namespace BodyParser {
        let enabled_1: boolean;
        export { enabled_1 as enabled };
        export namespace config_1 {
            export namespace opts_1 {
                let multipart: boolean;
                namespace formidable {
                    let maxFileSize: number;
                    let keepExtensions: boolean;
                }
            }
            export { opts_1 as opts };
        }
        export { config_1 as config };
    }
    namespace Compress {
        let enabled_2: boolean;
        export { enabled_2 as enabled };
        export namespace config_2 {
            export namespace opts_2 {
                function filter(content_type: any): boolean;
                let threshold: number;
            }
            export { opts_2 as opts };
        }
        export { config_2 as config };
    }
    namespace Cors {
        let enabled_3: boolean;
        export { enabled_3 as enabled };
    }
    namespace DynamicRoutes {
        let enabled_4: boolean;
        export { enabled_4 as enabled };
        export namespace config_3 {
            let routes: {
                expr: string;
                mapping: string;
            }[];
        }
        export { config_3 as config };
    }
    namespace ErrorHandler {
        let enabled_5: boolean;
        export { enabled_5 as enabled };
    }
    namespace TemplateHandler {
        let enabled_6: boolean;
        export { enabled_6 as enabled };
        export namespace config_4 {
            let mapping_1: string;
            export { mapping_1 as mapping };
        }
        export { config_4 as config };
    }
    namespace Log {
        let enabled_7: boolean;
        export { enabled_7 as enabled };
        export namespace config_5 {
            let mapping_2: string;
            export { mapping_2 as mapping };
        }
        export { config_5 as config };
    }
}
export let Plugins: {};
