// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/dbSqlite';

/**
 * GET /api/admin/status
 * Check if admin password has been set
 */
export async function GET(request: NextRequest) {
    try {
        const result = await query('SELECT COUNT(*) as count FROM admin');
        const passwordSet = result.rows[0].count > 0;

        return NextResponse.json({ passwordSet });
    } catch (error) {
        console.error('Error checking admin status:', error);
        return NextResponse.json(
            { error: 'Failed to check admin status' },
            { status: 500 }
        );
    }
}
