// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
import * as turf from '@turf/turf';

export interface ValidationResult {
    status: 'success' | 'error' | 'partial';
    errors: string[];
    features: ProcessedFeature[];
    summary: {
        total_features: number;
        valid_features: number;
        features_needing_review: number;
        total_area_ha: number;
    };
}

export interface ProcessedFeature {
    feature_index: number;
    properties: FeatureProperties;
    geometry: any;
    flags: string[];
    confidence: number;
    render_style: {
        fillColor: string;
        strokeColor: string;
        opacity: number;
    };
}

export interface FeatureProperties {
    claim_id: string;
    claim_type: string;
    holder_name: string | null;
    village_name: string | null;
    district: string | null;
    state: string | null;
    lgd_code: string | null;
    source_doc: string;
    area_ha: number;
    centroid: [number, number];
    bbox?: [number, number, number, number];
    supporting_documents_present: string | null;
    confidence: number;
    notes: string;
    repaired_geometry: boolean;
    flags: string[];
    extracted_fields?: string[];
}

function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function validateAndProcessGeoJSON(
    geojson: any,
    documentType: string,
    sourceDocId?: string
): ValidationResult {
    const errors: string[] = [];
    const processedFeatures: ProcessedFeature[] = [];

    // A. Validate GeoJSON structure
    if (!geojson || typeof geojson !== 'object') {
        return {
            status: 'error',
            errors: ['invalid_json'],
            features: [],
            summary: { total_features: 0, valid_features: 0, features_needing_review: 0, total_area_ha: 0 }
        };
    }

    if (geojson.type !== 'FeatureCollection') {
        return {
            status: 'error',
            errors: ['not_a_feature_collection'],
            features: [],
            summary: { total_features: 0, valid_features: 0, features_needing_review: 0, total_area_ha: 0 }
        };
    }

    if (!Array.isArray(geojson.features)) {
        return {
            status: 'error',
            errors: ['missing_features_array'],
            features: [],
            summary: { total_features: 0, valid_features: 0, features_needing_review: 0, total_area_ha: 0 }
        };
    }

    // H. Performance check
    const totalFeatures = geojson.features.length;
    if (totalFeatures > 200) {
        return {
            status: 'error',
            errors: ['too_many_features'],
            features: [],
            summary: { total_features: totalFeatures, valid_features: 0, features_needing_review: 0, total_area_ha: 0 }
        };
    }

    const featuresToProcess = geojson.features.slice(0, 100);

    // Process each feature
    featuresToProcess.forEach((feature: any, index: number) => {
        const flags: string[] = [];
        let confidence = 0.6; // default

        // Validate geometry
        if (!feature.geometry || !feature.geometry.type) {
            flags.push('invalid_geometry');
            confidence = 0.0;
        }

        const geometryType = feature.geometry?.type;
        if (geometryType !== 'Polygon' && geometryType !== 'MultiPolygon') {
            flags.push('invalid_geometry_type');
            confidence = 0.0;
        }

        // B. Normalize properties
        const props = feature.properties || {};

        const claim_id = props.claim_id || `${documentType}-TMP-${generateUUID().slice(0, 6)}`;
        const claim_type = props.claim_type || documentType;
        const holder_name = props.holder_name || null;
        const village_name = props.village_name || null;
        const district = props.district || null;
        const state = props.state || null;
        const lgd_code = props.lgd_code || null;
        const supporting_documents_present = props.supporting_documents_present || null;
        const notes = props.notes || '';

        // C. Compute derived attributes
        let area_ha = 0;
        let centroid: [number, number] = [0, 0];
        let bbox: [number, number, number, number] | undefined;

        try {
            if (feature.geometry && !flags.includes('invalid_geometry')) {
                // Compute area in hectares
                const areaM2 = turf.area(feature.geometry);
                area_ha = areaM2 / 10000; // convert to hectares

                // Compute centroid
                const centroidFeature = turf.centroid(feature.geometry);
                centroid = centroidFeature.geometry.coordinates as [number, number];

                // Compute bbox
                const bboxResult = turf.bbox(feature.geometry);
                bbox = bboxResult as [number, number, number, number];
            }
        } catch (err) {
            flags.push('geometry_calculation_error');
            confidence = Math.min(confidence, 0.3);
        }

        // D. Validations
        if (area_ha <= 0) {
            flags.push('invalid_area');
            confidence = 0.0;
        }

        if (claim_type === 'CFR' && area_ha < 0.5 && area_ha > 0) {
            flags.push('unusually_small_cfr');
        }

        if (!village_name) {
            flags.push('missing_village');
        }

        if (!holder_name) {
            flags.push('missing_holder_name');
        }

        // E. Confidence scoring
        let geometryScore = 0.2;
        if (!flags.includes('invalid_geometry') && !flags.includes('geometry_calculation_error')) {
            geometryScore = 0.5;
        }

        let completenessScore = 0;
        const requiredFields = [holder_name, village_name, district, state];
        const filledFields = requiredFields.filter(f => f !== null).length;
        completenessScore = (filledFields / requiredFields.length) * 0.4;

        const overlapScore = 0.1; // Mock - would need actual overlap checks

        confidence = Math.min(1.0, geometryScore + completenessScore + overlapScore);

        // Render style based on confidence
        let render_style;
        if (confidence >= 0.85) {
            render_style = { fillColor: '#2ecc71', strokeColor: '#27ae60', opacity: 0.45 };
        } else if (confidence >= 0.5) {
            render_style = { fillColor: '#f39c12', strokeColor: '#e67e22', opacity: 0.35 };
        } else {
            render_style = { fillColor: '#e74c3c', strokeColor: '#c0392b', opacity: 0.35 };
        }

        const processedFeature: ProcessedFeature = {
            feature_index: index,
            properties: {
                claim_id,
                claim_type,
                holder_name,
                village_name,
                district,
                state,
                lgd_code,
                source_doc: sourceDocId || 'uploaded_file.geojson',
                area_ha,
                centroid,
                bbox,
                supporting_documents_present,
                confidence,
                notes,
                repaired_geometry: false,
                flags,
            },
            geometry: feature.geometry,
            flags,
            confidence,
            render_style
        };

        processedFeatures.push(processedFeature);
    });

    // Calculate summary
    const validFeatures = processedFeatures.filter(f => f.confidence >= 0.5).length;
    const featuresNeedingReview = processedFeatures.filter(f => f.flags.length > 0).length;
    const totalAreaHa = processedFeatures.reduce((sum, f) => sum + f.properties.area_ha, 0);

    return {
        status: 'success',
        errors,
        features: processedFeatures,
        summary: {
            total_features: totalFeatures,
            valid_features: validFeatures,
            features_needing_review: featuresNeedingReview,
            total_area_ha: totalAreaHa
        }
    };
}

/**
 * Re-validates a feature after user edits.
 * Removes flags for corrected fields and recalculates confidence.
 */
export function revalidateFeature(
    feature: ProcessedFeature,
    updatedProperties: Partial<FeatureProperties>
): ProcessedFeature {
    // Merge updated properties
    const newProperties = {
        ...feature.properties,
        ...updatedProperties
    };

    // Start with existing flags
    let flags = [...feature.flags];

    // Remove flags for corrected fields
    if (newProperties.holder_name && newProperties.holder_name.trim() !== '') {
        flags = flags.filter(f => f !== 'missing_holder_name');
    } else if (!newProperties.holder_name) {
        // Add flag if field is now empty
        if (!flags.includes('missing_holder_name')) {
            flags.push('missing_holder_name');
        }
    }

    if (newProperties.village_name && newProperties.village_name.trim() !== '') {
        flags = flags.filter(f => f !== 'missing_village');
    } else if (!newProperties.village_name) {
        // Add flag if field is now empty
        if (!flags.includes('missing_village')) {
            flags.push('missing_village');
        }
    }

    // Recalculate confidence based on remaining flags and completeness
    let confidence = 0.6; // base confidence

    // Geometry score (unchanged from original)
    let geometryScore = 0.2;
    if (!flags.includes('invalid_geometry') && !flags.includes('geometry_calculation_error')) {
        geometryScore = 0.5;
    }

    // Completeness score
    const requiredFields = [
        newProperties.holder_name,
        newProperties.village_name,
        newProperties.district,
        newProperties.state
    ];
    const filledFields = requiredFields.filter(f => f !== null && f !== '').length;
    const completenessScore = (filledFields / requiredFields.length) * 0.4;

    const overlapScore = 0.1; // Mock - would need actual overlap checks

    confidence = Math.min(1.0, geometryScore + completenessScore + overlapScore);

    // If no flags remain and all required fields are filled, set high confidence
    if (flags.length === 0 && filledFields === requiredFields.length) {
        confidence = 0.95;
    }

    // Update render style based on new confidence
    let render_style;
    if (confidence >= 0.85) {
        render_style = { fillColor: '#2ecc71', strokeColor: '#27ae60', opacity: 0.45 };
    } else if (confidence >= 0.5) {
        render_style = { fillColor: '#f39c12', strokeColor: '#e67e22', opacity: 0.35 };
    } else {
        render_style = { fillColor: '#e74c3c', strokeColor: '#c0392b', opacity: 0.35 };
    }

    // Return updated feature
    return {
        ...feature,
        properties: {
            ...newProperties,
            confidence,
            flags
        },
        flags,
        confidence,
        render_style
    };
}
