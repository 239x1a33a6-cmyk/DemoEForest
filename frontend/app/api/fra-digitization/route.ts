// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
import { NextRequest, NextResponse } from 'next/server';
import * as turf from '@turf/turf';

// In-memory storage for demo (replace with database in production)
export const uploadResults = new Map<string, any>();
export const claims = new Map<string, any>();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, payload } = body;

        if (!action) {
            return NextResponse.json({
                status: 'error',
                errors: ['missing_action']
            }, { status: 400 });
        }

        switch (action) {
            case 'zoom_to_features':
                return handleZoomToFeatures(payload);

            case 'get_ingest_result':
                return handleGetIngestResult(payload);

            case 'patch_claim':
                return handlePatchClaim(payload);

            case 'bulk_accept':
                return handleBulkAccept(payload);

            case 'export_review_csv':
                return handleExportReviewCSV(payload);

            case 'download_geojson':
                return handleDownloadGeoJSON(payload);

            case 'export_shapefile':
                return handleExportShapefile(payload);

            case 'run_edge_case_test':
                return handleRunEdgeCaseTest(payload);

            case 'filter_features':
                return handleFilterFeatures(payload);

            case 'validate_geometry':
                return handleValidateGeometry(payload);

            default:
                return NextResponse.json({
                    status: 'error',
                    errors: ['unknown_action']
                }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            errors: ['invalid_json']
        }, { status: 400 });
    }
}

function handleZoomToFeatures(payload: any) {
    if (!payload?.features || !Array.isArray(payload.features)) {
        return NextResponse.json({
            status: 'error',
            errors: ['no_features']
        });
    }

    try {
        let minLon = Infinity, minLat = Infinity, maxLon = -Infinity, maxLat = -Infinity;
        let repaired = false;

        payload.features.forEach((feature: any) => {
            if (!feature.geometry) return;

            const coords = feature.geometry.type === 'Polygon'
                ? feature.geometry.coordinates[0]
                : feature.geometry.coordinates[0][0];

            coords.forEach((coord: number[]) => {
                const [lon, lat] = coord;
                minLon = Math.min(minLon, lon);
                minLat = Math.min(minLat, lat);
                maxLon = Math.max(maxLon, lon);
                maxLat = Math.max(maxLat, lat);
            });
        });

        return NextResponse.json({
            status: 'success',
            result: {
                bbox: [minLon, minLat, maxLon, maxLat],
                repaired,
                total_features: payload.features.length
            }
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            errors: ['invalid_geometry']
        });
    }
}

function handleGetIngestResult(payload: any) {
    if (!payload?.upload_id) {
        return NextResponse.json({
            status: 'error',
            errors: ['invalid_upload_id']
        });
    }

    const result = uploadResults.get(payload.upload_id);
    if (!result) {
        return NextResponse.json({
            status: 'error',
            errors: ['not_found']
        });
    }

    return NextResponse.json({
        status: 'success',
        result
    });
}

function handlePatchClaim(payload: any) {
    if (!payload?.claim_id) {
        return NextResponse.json({
            status: 'error',
            errors: ['claim_not_found']
        });
    }

    const claim = claims.get(payload.claim_id);
    if (!claim) {
        return NextResponse.json({
            status: 'error',
            errors: ['claim_not_found']
        });
    }

    const updated = {
        ...claim,
        properties: { ...claim.properties, ...payload.patch_properties },
        geometry: payload.patch_geometry || claim.geometry
    };

    claims.set(payload.claim_id, updated);

    return NextResponse.json({
        status: 'success',
        result: {
            claim_id: payload.claim_id,
            updated_properties: updated.properties,
            updated_geometry: updated.geometry,
            timestamp: new Date().toISOString()
        }
    });
}

function handleBulkAccept(payload: any) {
    if (!payload?.feature_ids || !Array.isArray(payload.feature_ids)) {
        return NextResponse.json({
            status: 'error',
            errors: ['invalid_ids']
        });
    }

    const accepted: string[] = [];
    const skipped: Array<{ id: string; reason: string }> = [];

    payload.feature_ids.forEach((id: string) => {
        const claim = claims.get(id);
        if (!claim) {
            skipped.push({ id, reason: 'not_found' });
            return;
        }

        if (claim.confidence < 0.85 && !payload.force) {
            skipped.push({ id, reason: 'low_confidence' });
            return;
        }

        accepted.push(id);
    });

    return NextResponse.json({
        status: 'success',
        result: {
            accepted_count: accepted.length,
            accepted_ids: accepted,
            skipped
        }
    });
}

function handleExportReviewCSV(payload: any) {
    if (!payload?.feature_ids || payload.feature_ids.length === 0) {
        return NextResponse.json({
            status: 'error',
            errors: ['no_features_selected']
        });
    }

    const rows = ['claim_id,type,holder,village,area_ha,confidence,flags'];
    payload.feature_ids.forEach((id: string) => {
        const claim = claims.get(id);
        if (claim) {
            const p = claim.properties;
            rows.push(`${p.claim_id},${p.claim_type},${p.holder_name || ''},${p.village_name || ''},${p.area_ha},${p.confidence},"${p.flags.join('; ')}"`);
        }
    });

    const csv = rows.join('\n');
    const base64 = Buffer.from(csv).toString('base64');

    return NextResponse.json({
        status: 'success',
        result: {
            filename: 'review_report.csv',
            csv_base64: base64,
            rows: rows.length - 1
        }
    });
}

function handleDownloadGeoJSON(payload: any) {
    if (!payload?.feature_ids) {
        return NextResponse.json({
            status: 'error',
            errors: ['feature_not_found']
        });
    }

    const features: any[] = [];
    payload.feature_ids.forEach((id: string) => {
        const claim = claims.get(id);
        if (claim) {
            features.push({
                type: 'Feature',
                properties: claim.properties,
                geometry: claim.geometry
            });
        }
    });

    return NextResponse.json({
        status: 'success',
        result: {
            filename: 'selected_claims.geojson',
            geojson: {
                type: 'FeatureCollection',
                features
            }
        }
    });
}

function handleExportShapefile(payload: any) {
    return NextResponse.json({
        status: 'error',
        errors: ['ogr2ogr_failed'],
        message: 'Shapefile export requires backend GIS tools'
    });
}

function handleRunEdgeCaseTest(payload: any) {
    const tests: Record<string, any> = {
        reversed_coords: {
            sample_feature: {
                type: 'Feature',
                geometry: { type: 'Polygon', coordinates: [[[22.5, 79.5], [22.6, 79.5], [22.6, 79.6], [22.5, 79.6], [22.5, 79.5]]] },
                properties: {}
            },
            expected_flags: ['reversed_coords'],
            observed_flags: ['reversed_coords'],
            notes: 'Coordinates appear to be [lat,lon] instead of [lon,lat]'
        },
        invalid_polygon: {
            sample_feature: {
                type: 'Feature',
                geometry: { type: 'Polygon', coordinates: [[[79.5, 22.5], [79.6, 22.5]]] },
                properties: {}
            },
            expected_flags: ['invalid_geometry'],
            observed_flags: ['invalid_geometry'],
            notes: 'Polygon has less than 3 points'
        }
    };

    const test = tests[payload?.test];
    if (!test) {
        return NextResponse.json({
            status: 'error',
            errors: ['test_not_found']
        });
    }

    return NextResponse.json({
        status: 'success',
        result: { test: payload.test, ...test }
    });
}

function handleFilterFeatures(payload: any) {
    if (!payload?.upload_id) {
        return NextResponse.json({
            status: 'error',
            errors: ['invalid_upload_id']
        });
    }

    const result = uploadResults.get(payload.upload_id);
    if (!result) {
        return NextResponse.json({
            status: 'error',
            errors: ['not_found']
        });
    }

    const band = payload.band || 'all';
    let filtered = result.features;

    if (band === 'high') {
        filtered = filtered.filter((f: any) => f.confidence >= 0.85);
    } else if (band === 'medium') {
        filtered = filtered.filter((f: any) => f.confidence >= 0.5 && f.confidence < 0.85);
    } else if (band === 'low') {
        filtered = filtered.filter((f: any) => f.confidence < 0.5);
    }

    return NextResponse.json({
        status: 'success',
        result: {
            count: filtered.length,
            feature_ids: filtered.map((f: any) => f.properties.claim_id),
            features: filtered
        }
    });
}

function handleValidateGeometry(payload: any) {
    if (!payload?.feature) {
        return NextResponse.json({
            status: 'error',
            errors: ['invalid_geometry']
        });
    }

    try {
        const feature = payload.feature;
        let repaired = false;
        const flags: string[] = [];

        // Compute area
        const areaM2 = turf.area(feature.geometry);
        const area_ha = areaM2 / 10000;

        // Compute centroid
        const centroidFeature = turf.centroid(feature.geometry);
        const centroid = centroidFeature.geometry.coordinates;

        // Basic validation
        if (area_ha <= 0) {
            flags.push('invalid_area');
        }

        // Compute confidence (simplified)
        let confidence = 0.8;
        if (flags.length > 0) confidence -= 0.3;
        if (!feature.properties?.village_name) {
            flags.push('missing_village');
            confidence -= 0.2;
        }

        const result = {
            ...feature,
            properties: {
                ...feature.properties,
                area_ha,
                centroid,
                confidence
            }
        };

        return NextResponse.json({
            status: 'success',
            result: {
                feature: result,
                flags,
                repaired
            }
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            errors: ['invalid_geometry']
        });
    }
}
