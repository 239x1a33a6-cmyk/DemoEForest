// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { query } from '@/lib/dbSqlite';
import { extractToken, verifyToken } from '@/lib/auth';

/**
 * GET /api/claims/list
 * Get list of all saved claims (requires authentication)
 */
export async function GET(request: NextRequest) {
    try {
        // Verify authentication
        const authHeader = request.headers.get('authorization');
        const token = extractToken(authHeader);

        if (!token) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        // Fetch claims with extracted properties for display
        // Note: SQLite JSON extraction syntax is json_extract(column, '$.path')
        const result = await query(`
            SELECT 
                id,
                claim_id,
                claim_type,
                json_extract(geojson, '$.properties') as properties,
                current_confidence,
                current_flags,
                saved_by,
                saved_at,
                version
            FROM claims
            ORDER BY saved_at DESC
        `);

        // Parse and format the response
        const claims = result.rows.map((row: any) => {
            // SQLite returns JSON extracted fields as strings or objects depending on driver
            // sqlite3 driver usually returns string for json_extract if it's an object
            const props = typeof row.properties === 'string' ? JSON.parse(row.properties) : (row.properties || {});
            const flags = typeof row.current_flags === 'string' ? JSON.parse(row.current_flags) : (row.current_flags || []);

            return {
                id: row.id,
                claim_id: row.claim_id,
                claim_type: row.claim_type,
                village: props.village_name || props.village || 'N/A',
                district: props.district || 'N/A',
                state: props.state || 'N/A',
                area_ha: props.area_ha || 0,
                confidence: row.current_confidence,
                flags: flags,
                saved_by: row.saved_by,
                saved_at: row.saved_at,
                version: row.version
            };
        });

        return NextResponse.json(claims);

    } catch (error) {
        console.error('Error fetching claims list:', error);
        return NextResponse.json(
            { error: 'Failed to fetch claims list' },
            { status: 500 }
        );
    }
}
