// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/dbSqlite';
import { randomUUID } from 'crypto';

/**
 * POST /api/claims/save
 * Save or update a claim with versioning
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { feature, saved_by } = body;

        // Validate request
        if (!feature || !feature.properties || !feature.geometry) {
            return NextResponse.json(
                { error: 'Invalid feature object' },
                { status: 400 }
            );
        }

        if (!saved_by) {
            return NextResponse.json(
                { error: 'saved_by is required' },
                { status: 400 }
            );
        }

        const {
            claim_id,
            claim_type,
            confidence,
            flags = []
        } = feature.properties;

        if (!claim_id || !claim_type || confidence === undefined) {
            return NextResponse.json(
                { error: 'Missing required properties: claim_id, claim_type, confidence' },
                { status: 400 }
            );
        }

        // Prepare data for storage
        // Strict Geometry Validation
        if (!feature.geometry || !feature.geometry.type || !feature.geometry.coordinates) {
            return NextResponse.json(
                { error: 'missing_geometry', message: 'Feature geometry missing or invalid' },
                { status: 400 }
            );
        }

        // Validate coordinates range (basic check)
        // TODO: Use Turf.js for more complex validation if needed
        const isPoint = feature.geometry.type === 'Point';
        const isPolygon = feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon';

        if (!isPoint && !isPolygon) {
            return NextResponse.json(
                { error: 'invalid_geometry_type', message: 'Only Point, Polygon, and MultiPolygon are supported' },
                { status: 400 }
            );
        }

        const geojsonStr = JSON.stringify(feature);
        const flagsStr = JSON.stringify(flags);

        // Use SQLite database operations
        const db = await getDb();

        // Check if claim already exists
        const existingClaim = await db.get(
            'SELECT id, version FROM claims WHERE claim_id = ?',
            [claim_id]
        );

        let claimDbId = existingClaim ? existingClaim.id : randomUUID();
        let newVersion = existingClaim ? existingClaim.version + 1 : 1;
        let savedAt;

        if (existingClaim) {
            // Update existing claim
            await db.run(
                `UPDATE claims 
                SET geojson = ?, current_flags = ?, current_confidence = ?, saved_by = ?, version = ?, saved_at = datetime('now'), claim_type = ?
                WHERE id = ?`,
                [geojsonStr, flagsStr, confidence, saved_by, newVersion, claim_type, claimDbId]
            );

            // Fetch updated timestamp
            const updated = await db.get('SELECT saved_at FROM claims WHERE id = ?', [claimDbId]);
            savedAt = updated.saved_at;

        } else {
            // Insert new claim
            await db.run(
                `INSERT INTO claims 
                (id, claim_id, claim_type, geojson, current_flags, current_confidence, saved_by, version, saved_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
                [claimDbId, claim_id, claim_type, geojsonStr, flagsStr, confidence, saved_by, newVersion]
            );

            // Fetch timestamp
            const inserted = await db.get('SELECT saved_at FROM claims WHERE id = ?', [claimDbId]);
            savedAt = inserted.saved_at;
        }

        // Archive version
        const versionId = randomUUID();
        await db.run(
            `INSERT INTO claim_versions 
            (id, claim_db_id, version, geojson, flags, confidence, saved_by, saved_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
            [versionId, claimDbId, newVersion, geojsonStr, flagsStr, confidence, saved_by]
        );

        const result = {
            id: claimDbId,
            claim_id,
            version: newVersion,
            saved_at: savedAt,
            has_geometry: true
        };

        return NextResponse.json({
            success: true,
            ...result
        });

    } catch (error: any) {
        console.error('Error saving claim:', error);
        return NextResponse.json(
            {
                error: 'Failed to save claim',
                details: String(error),
                stack: error.stack
            },
            { status: 500 }
        );
    }
}
