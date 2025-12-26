// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import bcrypt from 'bcryptjs';

// Database configuration
const dbPath = path.join(process.cwd(), 'fra_atlas.db');

let dbInstance: Database | null = null;

/**
 * Get database connection
 */
export async function getDb(): Promise<Database> {
    if (dbInstance) {
        return dbInstance;
    }

    dbInstance = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    // Enable foreign keys and WAL mode for better concurrency
    await dbInstance.run('PRAGMA foreign_keys = ON');
    await dbInstance.run('PRAGMA journal_mode = WAL');
    await dbInstance.run('PRAGMA busy_timeout = 5000');

    // Ensure admin table exists
    await dbInstance.run(`
        CREATE TABLE IF NOT EXISTS admin (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            hashed_password TEXT NOT NULL,
            created_at TEXT,
            updated_at TEXT
        )
    `);

    // Ensure claims table exists
    await dbInstance.run(`
        CREATE TABLE IF NOT EXISTS claims (
            id TEXT PRIMARY KEY,
            claim_id TEXT UNIQUE NOT NULL,
            claim_type TEXT NOT NULL,
            geojson TEXT NOT NULL,
            current_flags TEXT,
            current_confidence REAL,
            saved_by TEXT,
            version INTEGER DEFAULT 1,
            saved_at TEXT
        )
    `);

    // Ensure claim_versions table exists
    await dbInstance.run(`
        CREATE TABLE IF NOT EXISTS claim_versions (
            id TEXT PRIMARY KEY,
            claim_db_id TEXT NOT NULL,
            version INTEGER NOT NULL,
            geojson TEXT NOT NULL,
            flags TEXT,
            confidence REAL,
            saved_by TEXT,
            saved_at TEXT,
            FOREIGN KEY (claim_db_id) REFERENCES claims(id)
        )
    `);

    // Ensure audit_log table exists
    await dbInstance.run(`
        CREATE TABLE IF NOT EXISTS audit_log (
            id TEXT PRIMARY KEY,
            action TEXT NOT NULL,
            user_identifier TEXT,
            ip_address TEXT,
            success INTEGER,
            details TEXT,
            created_at TEXT
        )
    `);

    // Ensure an admin record exists with a default password if none set
    await ensureAdminPassword();
    return dbInstance;
}

/**
 * Execute a query with parameters (SQLite version)
 */
export async function query<T = any>(
    text: string,
    params?: any[]
): Promise<{ rows: T[] }> {
    const db = await getDb();

    try {
        const rows = await db.all(text, params || []);
        return { rows };
    } catch (error) {
        console.error('SQLite query error:', error);
        throw error;
    }
}

/**
 * Close database connection
 */
export async function closeDb(): Promise<void> {
    if (dbInstance) {
        await dbInstance.close();
        dbInstance = null;
    }
}

export default {
    getDb,
    query,
    closeDb,
    ensureAdminPassword,
};

/**
 * Ensure there is at least one admin entry with a default password.
 * This runs on server start. If an admin already exists, it does nothing.
 */
export async function ensureAdminPassword() {
    const db = await getDb();
    const result = await db.get('SELECT COUNT(*) as count FROM admin');
    if (result?.count === 0) {
        const defaultPassword = 'admin123'; // you can change this later
        const hashed = await bcrypt.hash(defaultPassword, 12);
        await db.run('INSERT INTO admin (hashed_password, created_at, updated_at) VALUES (?, datetime("now"), datetime("now"))', [hashed]);
        console.log('✅ Default admin password set to "admin123"');
    }
}
