// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/dbSqlite';
import { randomUUID } from 'crypto';

/**
 * POST /api/geo-ingest
 * Ingest GeoJSON file and save claims to database
 */
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const documentType = formData.get('document_type') as string;
        const uploadedBy = formData.get('uploaded_by') as string;

        if (!file) {
            return NextResponse.json({
                status: 'error',
                message: 'No file provided'
            }, { status: 400 });
        }

        // Validate file type
        if (!file.name.endsWith('.geojson') && !file.name.endsWith('.json')) {
            return NextResponse.json({
                status: 'error',
                message: 'Invalid file type. Only .geojson or .json files are allowed.'
            }, { status: 400 });
        }

        // Parse GeoJSON file
        const text = await file.text();
        let geojsonData: any;

        try {
            geojsonData = JSON.parse(text);
        } catch (e) {
            return NextResponse.json({
                status: 'error',
                message: 'Invalid JSON format'
            }, { status: 400 });
        }

        // Validate GeoJSON structure
        if (!geojsonData.type || !geojsonData.features) {
            return NextResponse.json({
                status: 'error',
                message: 'Invalid GeoJSON structure. Must have type and features.'
            }, { status: 400 });
        }

        const db = await getDb();
        const savedClaims: any[] = [];
        const errors: string[] = [];

        // Process each feature
        for (let i = 0; i < geojsonData.features.length; i++) {
            const feature = geojsonData.features[i];

            try {
                // Generate unique claim ID
                const claimId = feature.properties?.claim_id || `${documentType}-${Date.now()}-${i + 1}`;
                const dbId = randomUUID();

                // Validate geometry
                if (!feature.geometry || !feature.geometry.type || !feature.geometry.coordinates) {
                    errors.push(`Feature ${i + 1}: Missing or invalid geometry`);
                    continue;
                }

                // Extract properties
                const confidence = feature.properties?.confidence || feature.properties?.extraction_confidence || 0.5;
                const flags = feature.properties?.flags || feature.properties?.validation?.flags || [];

                // Save to database
                await db.run(
                    `INSERT INTO claims 
                    (id, claim_id, claim_type, geojson, current_flags, current_confidence, saved_by, version, saved_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
                    [
                        dbId,
                        claimId,
                        documentType,
                        JSON.stringify(feature),
                        JSON.stringify(flags),
                        confidence,
                        uploadedBy || 'system',
                        1
                    ]
                );

                // Save version
                const versionId = randomUUID();
                await db.run(
                    `INSERT INTO claim_versions 
                    (id, claim_db_id, version, geojson, flags, confidence, saved_by, saved_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
                    [
                        versionId,
                        dbId,
                        1,
                        JSON.stringify(feature),
                        JSON.stringify(flags),
                        confidence,
                        uploadedBy || 'system'
                    ]
                );

                savedClaims.push({
                    id: dbId,
                    claim_id: claimId,
                    claim_type: documentType
                });

            } catch (err: any) {
                errors.push(`Feature ${i + 1}: ${err.message}`);
            }
        }

        // Calculate summary statistics
        const totalArea = savedClaims.reduce((sum, claim) => {
            const feature = geojsonData.features.find((f: any) =>
                (f.properties?.claim_id || `${documentType}-${Date.now()}`) === claim.claim_id
            );
            const area = feature?.properties?.area_ha || feature?.properties?.extent_ha || 0;
            return sum + area;
        }, 0);

        const validFeatures = savedClaims.filter(claim => {
            const feature = geojsonData.features.find((f: any) =>
                (f.properties?.claim_id || `${documentType}-${Date.now()}`) === claim.claim_id
            );
            const confidence = feature?.properties?.confidence || feature?.properties?.extraction_confidence || 0.5;
            return confidence >= 0.5;
        }).length;

        const featuresNeedingReview = savedClaims.filter(claim => {
            const feature = geojsonData.features.find((f: any) =>
                (f.properties?.claim_id || `${documentType}-${Date.now()}`) === claim.claim_id
            );
            const flags = feature?.properties?.flags || feature?.properties?.validation?.flags || [];
            return flags.length > 0;
        }).length;

        // Prepare features array for frontend with enhanced properties
        const features = geojsonData.features.map((feature: any, index: number) => {
            const savedClaim = savedClaims.find(c => c.claim_id === (feature.properties?.claim_id || `${documentType}-${Date.now()}-${index + 1}`));

            return {
                ...feature,
                properties: {
                    ...feature.properties,
                    claim_id: savedClaim?.claim_id || feature.properties?.claim_id || `${documentType}-${Date.now()}-${index + 1}`,
                    claim_type: documentType,
                    confidence: feature.properties?.confidence || feature.properties?.extraction_confidence || 0.5,
                    flags: feature.properties?.flags || feature.properties?.validation?.flags || [],
                    db_id: savedClaim?.id,
                    saved: !!savedClaim
                }
            };
        });

        return NextResponse.json({
            status: 'success',
            message: `Successfully ingested ${savedClaims.length} claims`,
            summary: {
                total_features: geojsonData.features.length,
                valid_features: validFeatures,
                features_needing_review: featuresNeedingReview,
                total_area_ha: totalArea
            },
            features: features,
            saved_claims: savedClaims,
            errors: errors.length > 0 ? errors : undefined,
            successful: savedClaims.length,
            failed: errors.length
        });

    } catch (error: any) {
        console.error('Error ingesting GeoJSON:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Failed to ingest GeoJSON',
            details: error.message
        }, { status: 500 });
    }
}
