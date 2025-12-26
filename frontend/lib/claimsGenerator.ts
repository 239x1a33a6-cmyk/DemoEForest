import { ClaimGeoJSONFeature, ClaimType, ClaimStatus, AnalyticsData } from '@/types/atlas';
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

        // Strategy 2: Fallback to Centroid + Jitter (only if no geometry)
        if (!coordinates && !districtGeometry && centroid) {
            coordinates = randomCoordinates(centroid);
        }

        return coordinates;
    };

    // Configuration for claim generation - Increased count
    const totalClaims = randomInt(30, 60);
    const numIfr = Math.floor(totalClaims * 0.5);
    const numCr = Math.floor(totalClaims * 0.2);
    const numCfr = totalClaims - numIfr - numCr;

    // Generate aggregate counts for the area (simulated)
    const areaStats = {
        ifrCount: numIfr + randomInt(5, 20),
        cfrCount: numCfr + randomInt(2, 10),
        crCount: numCr + randomInt(2, 10)
    };

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

            // Random status generation including Filed and Rejected
            const rand = Math.random();
            let status: ClaimStatus = 'Pending';
            if (rand > 0.7) status = 'Approved';
            else if (rand > 0.5) status = 'Rejected';
            else if (rand > 0.3) status = 'Filed';
            else status = 'Pending';

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
                    state: state,
                    ifrCount: areaStats.ifrCount,
                    cfrCount: areaStats.cfrCount,
                    crCount: areaStats.crCount
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
                state: state,
                ifrCount: areaStats.ifrCount,
                cfrCount: areaStats.cfrCount,
                crCount: areaStats.crCount
            }
        });
    }

    console.log(`Generated ${features.length} claims for ${district} (Target: ${totalClaims} + 1 Oktakailu)`);

    return {
        type: 'FeatureCollection',
        features
    };
}

/**
 * Calculate analytics from generated claims data
 */
export function calculateAnalytics(claimsData: ClaimsGeoJSON | null): AnalyticsData {
    // Default empty structure
    const analytics: AnalyticsData = {
        overview: {
            totalClaims: 0,
            approvedClaims: 0,
            pendingClaims: 0,
            rejectedClaims: 0,
            totalArea: 0,
            totalBeneficiaries: 0
        },
        byType: {
            ifr: { count: 0, area: 0 },
            cr: { count: 0, area: 0 },
            cfr: { count: 0, area: 0 }
        },
        byState: [], // We'll populate this if we have state info, but for single district it's one entry
        timeline: [],
        vulnerability: {
            waterHigh: 0,
            waterMedium: 0,
            waterLow: 0,
            livelihoodHigh: 0,
            livelihoodMedium: 0,
            livelihoodLow: 0
        }
    };

    if (!claimsData || !claimsData.features) return analytics;

    const features = claimsData.features;

    // Overview Stats
    analytics.overview.totalClaims = features.length;
    analytics.overview.approvedClaims = features.filter(f => f.properties.status === 'Approved').length;
    analytics.overview.pendingClaims = features.filter(f => f.properties.status === 'Pending').length;
    analytics.overview.rejectedClaims = features.filter(f => f.properties.status === 'Rejected').length;

    // Area Stats
    const totalArea = features.reduce((sum, f) => sum + (f.properties.area_acres || 0), 0);
    analytics.overview.totalArea = parseFloat(totalArea.toFixed(2));

    // Beneficiaries (Simulated based on claims)
    analytics.overview.totalBeneficiaries = Math.floor(analytics.overview.totalClaims * 1.5); // Avg 1.5 beneficiaries per claim

    // By Type Stats
    const ifrClaims = features.filter(f => f.properties.claim_type === 'IFR');
    const crClaims = features.filter(f => f.properties.claim_type === 'CR');
    const cfrClaims = features.filter(f => f.properties.claim_type === 'CFR');

    analytics.byType.ifr.count = ifrClaims.length;
    analytics.byType.ifr.area = parseFloat(ifrClaims.reduce((sum, f) => sum + (f.properties.area_acres || 0), 0).toFixed(2));

    analytics.byType.cr.count = crClaims.length;
    analytics.byType.cr.area = parseFloat(crClaims.reduce((sum, f) => sum + (f.properties.area_acres || 0), 0).toFixed(2));

    analytics.byType.cfr.count = cfrClaims.length;
    analytics.byType.cfr.area = parseFloat(cfrClaims.reduce((sum, f) => sum + (f.properties.area_acres || 0), 0).toFixed(2));

    // Vulnerability (Simulated distribution)
    const total = analytics.overview.totalClaims;
    analytics.vulnerability.waterHigh = Math.floor(total * 0.2);
    analytics.vulnerability.waterMedium = Math.floor(total * 0.5);
    analytics.vulnerability.waterLow = total - analytics.vulnerability.waterHigh - analytics.vulnerability.waterMedium;

    analytics.vulnerability.livelihoodHigh = Math.floor(total * 0.15);
    analytics.vulnerability.livelihoodMedium = Math.floor(total * 0.45);
    analytics.vulnerability.livelihoodLow = total - analytics.vulnerability.livelihoodHigh - analytics.vulnerability.livelihoodMedium;

    return analytics;
}
