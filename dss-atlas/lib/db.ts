// Database connection utility for PostgreSQL/PostGIS
import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'fra_atlas',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};

// Create connection pool
let pool: Pool | null = null;

/**
 * Get or create database connection pool
 */
export function getPool(): Pool {
    if (!pool) {
        pool = new Pool(dbConfig);

        pool.on('error', (err) => {
            console.error('Unexpected error on idle client', err);
            process.exit(-1);
        });
    }
    return pool;
}

/**
 * Execute a query with parameters
 */
export async function query<T extends QueryResultRow = any>(
    text: string,
    params?: any[]
): Promise<QueryResult<T>> {
    const pool = getPool();
    const start = Date.now();

    try {
        const result = await pool.query<T>(text, params);
        const duration = Date.now() - start;

        if (process.env.NODE_ENV === 'development') {
            console.log('Executed query', { text, duration, rows: result.rowCount });
        }

        return result;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

/**
 * Get a client from the pool for transactions
 */
export async function getClient(): Promise<PoolClient> {
    const pool = getPool();
    return await pool.connect();
}

/**
 * Execute multiple queries in a transaction
 */
export async function transaction<T>(
    callback: (client: PoolClient) => Promise<T>
): Promise<T> {
    const client = await getClient();

    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

/**
 * Close the database pool
 */
export async function closePool(): Promise<void> {
    if (pool) {
        await pool.end();
        pool = null;
    }
}

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
    try {
        const result = await query('SELECT NOW()');
        console.log('Database connection successful:', result.rows[0]);
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
}

/**
 * Helper function to convert PostGIS geometry to GeoJSON
 */
export function geomToGeoJSON(geom: any): any {
    if (!geom) return null;

    // If already parsed as JSON
    if (typeof geom === 'object') {
        return geom;
    }

    // If string, parse it
    if (typeof geom === 'string') {
        try {
            return JSON.parse(geom);
        } catch {
            return null;
        }
    }

    return null;
}

/**
 * Build WHERE clause from filters
 */
export function buildWhereClause(
    filters: Record<string, any>,
    startIndex: number = 1
): { clause: string; params: any[] } {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = startIndex;

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            conditions.push(`${key} = $${paramIndex}`);
            params.push(value);
            paramIndex++;
        }
    });

    const clause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    return { clause, params };
}

/**
 * Execute a spatial query with bounding box
 */
export async function spatialQuery<T extends QueryResultRow = any>(
    table: string,
    bounds?: { north: number; south: number; east: number; west: number },
    additionalWhere?: string,
    additionalParams?: any[]
): Promise<QueryResult<T>> {
    let whereClause = '';
    const params: any[] = [];
    let paramIndex = 1;

    if (bounds) {
        const bbox = `ST_MakeEnvelope($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3}, 4326)`;
        whereClause = `WHERE ST_Intersects(geom, ${bbox})`;
        params.push(bounds.west, bounds.south, bounds.east, bounds.north);
        paramIndex += 4;
    }

    if (additionalWhere) {
        whereClause += (whereClause ? ' AND ' : 'WHERE ') + additionalWhere;
        if (additionalParams) {
            params.push(...additionalParams);
        }
    }

    const sql = `
        SELECT 
            *,
            ST_AsGeoJSON(geom) as geojson
        FROM ${table}
        ${whereClause}
    `;

    return await query<T>(sql, params);
}

export default {
    query,
    getClient,
    transaction,
    closePool,
    testConnection,
    geomToGeoJSON,
    buildWhereClause,
    spatialQuery,
};
