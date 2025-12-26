declare module 'shapefile' {
    export function open(
        shp: string | Buffer,
        dbf?: string | Buffer
    ): Promise<{
        read(): Promise<{ done: boolean; value?: any }>;
    }>;
}
