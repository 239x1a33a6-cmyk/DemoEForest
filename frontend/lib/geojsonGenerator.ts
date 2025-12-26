// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
import type { ValidatedClaim } from './claimValidator';

export interface GeoJSONFeature {
    type: 'Feature';
    id: string;
    properties: any;
    geometry: {
        type: 'Point';
        coordinates: [number, number];
    } | null;
}

export interface GeoJSONFeatureCollection {
    type: 'FeatureCollection';
    features: GeoJSONFeature[];
}

/**
 * Generate GeoJSON FeatureCollection from validated claims
 */
export function generateGeoJSON(
    claims: ValidatedClaim[],
    documentPath: string,
    timestamp: number,
    uuid: string
): GeoJSONFeatureCollection {
    const features: GeoJSONFeature[] = claims.map((claim, index) => {
        const claimId = `${timestamp}-${uuid}-${index + 1}`;

        // Create geometry if coordinates exist
        let geometry: any = null;
        if (claim.lat !== null && claim.lon !== null &&
            claim.lat !== undefined && claim.lon !== undefined) {
            geometry = {
                type: 'Point',
                coordinates: [claim.lon, claim.lat] // GeoJSON is [lon, lat]
            };
        }

        return {
            type: 'Feature',
            id: claimId,
            properties: {
                claim_id: claimId,
                name: claim.name,
                village: claim.village,
                district: claim.district,
                state: claim.state,
                extent_ha: claim.extent_ha,
                validation: claim.validation,
                structured_json_found: claim.structured_json_found,
                extraction_confidence: claim.extraction_confidence
            },
            geometry
        };
    });

    return {
        type: 'FeatureCollection',
        features
    };
}
