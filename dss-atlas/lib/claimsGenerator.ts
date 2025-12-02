import { ClaimGeoJSONFeature, ClaimType, ClaimStatus } from '@/types/atlas';
import { getDistrictCentroid } from './districtCentroids';
import * as turf from '@turf/turf';

export interface ClaimsGeoJSON {
    type: 'FeatureCollection';
    features: ClaimGeoJSONFeature[];
}

// Helper to generate random integer between min and max (inclusive)
function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to generate random float between min and max
function randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

// Helper to generate random coordinates around a center point
// Jitter is roughly in degrees (0.25 deg is approx 25km, covering a typical district)
function randomCoordinates(center: [number, number], jitter: number = 0.25): [number, number] {
    const lng = center[0] + (Math.random() - 0.5) * jitter * 2;
    const lat = center[1] + (Math.random() - 0.5) * jitter * 2;
    return [lng, lat];
}

const firstNames = [
    'Raju', 'Laxmi', 'Ramu', 'Sita', 'Ravi', 'Anjaiah', 'Manda', 'Bhima', 'Sarita', 'Gopal',
    'Jamuna', 'Biru', 'Kalia', 'Soma', 'Ramesh', 'Savita', 'Bhura', 'Rina', 'Paresh', 'Charan',
    'Sudip', 'Kamalini', 'Manik', 'Arjun', 'Devi', 'Krishna', 'Radha', 'Mohan', 'Gauri', 'Shankar'
];

const lastNames = [
    'Naik', 'Bai', 'Gond', 'Kumari', 'Mudiraj', 'Pangi', 'Korram', 'Hikaka', 'Oram', 'Munda',
    'Ekka', 'Bhilala', 'Adivasi', 'Singh', 'Tripuri', 'Debbarma', 'Jamatia', 'Reang', 'Tripura', 'Das',
    'Murmu', 'Soren', 'Hembram', 'Tudu', 'Kisne', 'Marandi', 'Hansda', 'Baske', 'Besra', 'Hemrom'
];

function getRandomName(): string {
    const first = firstNames[randomInt(0, firstNames.length - 1)];
    const last = lastNames[randomInt(0, lastNames.length - 1)];
    return `${first} ${last}`;
}

/**
 * Generate random claims for a specific district
 */
export function generateDistrictClaims(state: string, district: string, districtGeometry?: any): ClaimsGeoJSON {
    const features: ClaimGeoJSONFeature[] = [];
    const centroid = getDistrictCentroid(district);

    // Helper to generate a valid point
    const generatePoint = (): [number, number] | null => {
        let coordinates: [number, number] | null = null;

        // Strategy 1: Use District Geometry if available
        if (districtGeometry) {
            try {
                const bbox = turf.bbox(districtGeometry);
                let attempts = 0;
                while (attempts < 100) {
                    const randomPt = turf.randomPoint(1, { bbox: bbox });
                    const pt = randomPt.features[0];
                    if (turf.booleanPointInPolygon(pt, districtGeometry)) {
                        coordinates = pt.geometry.coordinates as [number, number];
                        break;
                    }
                    attempts++;
                }
            } catch (err) {
                console.warn('Error generating point in polygon:', err);
            }
        }

        // Strategy 2: Fallback to Centroid + Jitter
        if (!coordinates && !districtGeometry && centroid) {
            coordinates = randomCoordinates(centroid);
        }

        return coordinates;
    };

    // Configuration for claim generation
    const totalClaims = randomInt(20, 50);
    const numIfr = Math.floor(totalClaims * 0.5);
    const numCr = Math.floor(totalClaims * 0.2);
    const numCfr = totalClaims - numIfr - numCr;

    const config = [
        { type: 'IFR' as ClaimType, count: numIfr, color: 'Blue' },
        { type: 'CR' as ClaimType, count: numCr, color: 'Orange' },
        { type: 'CFR' as ClaimType, count: numCfr, color: 'Green' }
    ];

    // Generate standard claims
    config.forEach(conf => {
        for (let i = 1; i <= conf.count; i++) {
            const coordinates = generatePoint();
            if (!coordinates) continue;

            const id = `${state.substring(0, 2).toUpperCase()}_${district.substring(0, 3).toUpperCase()}_${conf.type}_${i.toString().padStart(3, '0')}`;
            const status: ClaimStatus = Math.random() > 0.5 ? 'Approved' : 'Pending';

            let holderName = '';
            let villageName = `Village_${randomInt(1, 400)}`;

            if (conf.type === 'IFR') {
                holderName = getRandomName();
            } else {
                holderName = `${villageName} ${conf.type} Committee`;
            }

            features.push({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: coordinates
                },
                properties: {
                    claim_id: id,
                    claim_type: conf.type,
                    holder_or_community: holderName,
                    status: status,
                    area_acres: parseFloat(randomFloat(0.5, 4.0).toFixed(2)),
                    village: villageName,
                    district: district,
                    state: state
                }
            });
        }
    });

    // Add specific "Oktakailu" claim (Required for demo)
    const oktCoordinates = generatePoint();
    if (oktCoordinates) {
        features.push({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: oktCoordinates
            },
            properties: {
                claim_id: `${state.substring(0, 2).toUpperCase()}_${district.substring(0, 3).toUpperCase()}_IFR_OKT`,
                claim_type: 'IFR',
                holder_or_community: 'Oktakailu Patta Holder',
                status: 'Approved',
                area_acres: 2.0,
                village: 'Oktakailu',
                district: district,
                state: state
            }
        });
    }

    console.log(`Generated ${features.length} claims for ${district} (Target: ${totalClaims} + 1 Oktakailu)`);

    return {
        type: 'FeatureCollection',
        features
    };
}
