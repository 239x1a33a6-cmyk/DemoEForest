declare module 'shpjs' {
    export function parseShp(buffer: Buffer | ArrayBuffer): any;
    export function parseDbf(buffer: Buffer | ArrayBuffer): any;
    export function combine(arr: [any, any]): any;
    export default function shp(input: string | Buffer | ArrayBuffer): Promise<any>;
}
