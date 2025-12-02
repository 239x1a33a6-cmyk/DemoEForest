// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
import { query } from '@/lib/db';
import { extractToken, verifyToken } from '@/lib/auth';

/**
 * GET /api/claims/[id]/versions
 * Get version history for a claim (requires authentication)
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

        // Fetch version history
        const result = await query(
            `SELECT 
                id,
                version,
                geojson,
                flags,
                confidence,
                saved_by,
                saved_at
            FROM claim_versions
            WHERE claim_db_id = ?
            ORDER BY version DESC`,
            [id]
        );

        const versions = result.rows.map((row: any) => {
            const geojson = typeof row.geojson === 'string' ? JSON.parse(row.geojson) : row.geojson;
            const flags = typeof row.flags === 'string' ? JSON.parse(row.flags) : row.flags;

            return {
                id: row.id,
                version: row.version,
                geojson: geojson,
                flags: flags,
                confidence: row.confidence,
                saved_by: row.saved_by,
                saved_at: row.saved_at
            };
        });

        return NextResponse.json(versions);

    } catch (error) {
        console.error('Error fetching claim versions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch claim versions' },
            { status: 500 }
        );
    }
}
