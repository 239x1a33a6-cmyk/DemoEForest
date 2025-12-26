// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
import type { ExtractedClaim } from './claimExtractor';
import { isDuplicateText, isDuplicateCoordinates, areClustered } from './utils/fuzzyMatch';

export interface ClaimValidation {
    missing_fields: string[];
    invalid_fields: string[];
    duplicate: boolean;
    cluster_flag: boolean;
    out_of_state: boolean;
    low_confidence: boolean;
    explanations: string[];
}

export interface ValidatedClaim extends ExtractedClaim {
    validation: ClaimValidation;
}

/**
 * Validate claims and add validation flags
 */
export function validateClaims(claims: ExtractedClaim[]): ValidatedClaim[] {
    const validated: ValidatedClaim[] = [];

    for (let i = 0; i < claims.length; i++) {
        const claim = claims[i];
        const validation: ClaimValidation = {
            missing_fields: [],
            invalid_fields: [],
            duplicate: false,
            cluster_flag: false,
            out_of_state: false,
            low_confidence: false,
            explanations: []
        };

        // Check missing required fields
        if (!claim.name) {
            validation.missing_fields.push('name');
            validation.explanations.push('Claimant name is missing');
        }
        if (!claim.village) {
            validation.missing_fields.push('village');
            validation.explanations.push('Village name is missing');
        }
        if (!claim.district) {
            validation.missing_fields.push('district');
            validation.explanations.push('District is missing');
        }
        if (!claim.state) {
            validation.missing_fields.push('state');
            validation.explanations.push('State is missing');
        }

        // Validate field ranges
        if (claim.lat !== null && claim.lat !== undefined) {
            if (claim.lat < -90 || claim.lat > 90) {
                validation.invalid_fields.push('lat');
                validation.explanations.push(`Latitude ${claim.lat} is out of valid range (-90 to 90)`);
            }
        }

        if (claim.lon !== null && claim.lon !== undefined) {
            if (claim.lon < -180 || claim.lon > 180) {
                validation.invalid_fields.push('lon');
                validation.explanations.push(`Longitude ${claim.lon} is out of valid range (-180 to 180)`);
            }
        }

        if (claim.extent_ha !== null && claim.extent_ha !== undefined) {
            if (claim.extent_ha < 0) {
                validation.invalid_fields.push('extent_ha');
                validation.explanations.push('Area cannot be negative');
            }
        }

        // Check for duplicates
        for (let j = 0; j < i; j++) {
            const otherClaim = claims[j];

            if (isDuplicateText(claim, otherClaim) || isDuplicateCoordinates(claim as any, otherClaim as any)) {
                validation.duplicate = true;
                validation.explanations.push(`Possible duplicate of claim ${j + 1}`);
                break;
            }
        }

        // Check for clustering
        for (let j = 0; j < claims.length; j++) {
            if (i !== j && areClustered(claim as any, claims[j] as any)) {
                validation.cluster_flag = true;
                validation.explanations.push(`Clustered with claim ${j + 1} (within 50m)`);
                break;
            }
        }

        // Check if coordinates are in India (rough bounds)
        if (claim.lat && claim.lon) {
            const inIndia = claim.lat >= 6 && claim.lat <= 37 && claim.lon >= 68 && claim.lon <= 97;
            if (!inIndia) {
                validation.out_of_state = true;
                validation.explanations.push('Coordinates appear to be outside India');
            }
        }

        // Check extraction confidence
        if (claim.extraction_confidence < 0.5) {
            validation.low_confidence = true;
            validation.explanations.push(`Low extraction confidence (${(claim.extraction_confidence * 100).toFixed(0)}%)`);
        }

        validated.push({
            ...claim,
            validation
        });
    }

    return validated;
}

/**
 * Generate validation summary
 */
export function generateValidationSummary(claims: ValidatedClaim[]) {
    return {
        total: claims.length,
        valid: claims.filter(c =>
            c.validation.missing_fields.length === 0 &&
            c.validation.invalid_fields.length === 0 &&
            !c.validation.duplicate &&
            !c.validation.low_confidence
        ).length,
        invalid: claims.filter(c =>
            c.validation.invalid_fields.length > 0
        ).length,
        missingCoordinates: claims.filter(c => !c.lat || !c.lon).length,
        duplicates: claims.filter(c => c.validation.duplicate).length,
        clustered: claims.filter(c => c.validation.cluster_flag).length
    };
}
