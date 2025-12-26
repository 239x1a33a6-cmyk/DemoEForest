// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { extractToken, verifyToken } from '@/lib/auth';
export const dynamic = 'force-dynamic';

/**
 * GET /api/claims/[id]
 * Get full claim details including GeoJSON (requires authentication)
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const { id } = params;

        // Fetch full claim data
        const result = await query(
            `SELECT 
                id,
                claim_id,
                claim_type,
                geojson,
                current_flags,
                current_confidence,
                saved_by,
                saved_at,
                version
            FROM claims
            WHERE id = ?`,
            [id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Claim not found' },
                { status: 404 }
            );
        }

        const claim = result.rows[0];

        // Parse JSON fields
        const geojson = typeof claim.geojson === 'string' ? JSON.parse(claim.geojson) : claim.geojson;
        const flags = typeof claim.current_flags === 'string' ? JSON.parse(claim.current_flags) : claim.current_flags;

        return NextResponse.json({
            id: claim.id,
            claim_id: claim.claim_id,
            claim_type: claim.claim_type,
            geojson: geojson,
            current_flags: flags,
            current_confidence: claim.current_confidence,
            saved_by: claim.saved_by,
            saved_at: claim.saved_at,
            version: claim.version
        });

    } catch (error: any) {
        console.error('Error fetching claim details:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch claim details',
                details: String(error),
                stack: error.stack
            },
            { status: 500 }
        );
    }
}
