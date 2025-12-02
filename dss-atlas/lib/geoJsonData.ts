// GeoJSON data generators and utilities for FRA Atlas

import { Coordinates, FRAFeatureProperties, VillageFeatureProperties, AssetFeatureProperties } from '@/types/atlas';

// State coordinates for India
export const stateCoordinates: Record<string, Coordinates & { zoom: number }> = {
    'Jharkhand': { lat: 23.6102, lng: 85.2799, zoom: 8 },
    'Madhya Pradesh': { lat: 22.9734, lng: 78.6569, zoom: 7 },
    'Odisha': { lat: 20.9517, lng: 85.0985, zoom: 8 },
    'Tripura': { lat: 23.9408, lng: 91.9882, zoom: 9 },
    'Telangana': { lat: 18.1124, lng: 79.0193, zoom: 8 },
    'Chhattisgarh': { lat: 21.2787, lng: 81.8661, zoom: 8 },
    'Maharashtra': { lat: 19.7515, lng: 75.7139, zoom: 7 },
    'Gujarat': { lat: 22.2587, lng: 71.1924, zoom: 7 },
    'Rajasthan': { lat: 27.0238, lng: 74.2179, zoom: 7 },
    'Karnataka': { lat: 15.3173, lng: 75.7139, zoom: 7 },
    'Andhra Pradesh': { lat: 15.9129, lng: 79.7400, zoom: 7 },
};

// District coordinates
export const districtCoordinates: Record<string, Coordinates & { zoom: number }> = {
    // Jharkhand
    'Ranchi': { lat: 23.3441, lng: 85.3096, zoom: 10 },
    'East Singhbhum': { lat: 22.8046, lng: 86.2029, zoom: 10 },
    'West Singhbhum': { lat: 22.5562, lng: 85.0449, zoom: 10 },
    // Madhya Pradesh
    'Dindori': { lat: 22.9417, lng: 81.0833, zoom: 10 },
    'Mandla': { lat: 22.5986, lng: 80.3714, zoom: 10 },
    'Jhabua': { lat: 22.7676, lng: 74.5953, zoom: 10 },
    // Odisha
    'Mayurbhanj': { lat: 21.9287, lng: 86.7350, zoom: 10 },
    'Sundargarh': { lat: 22.1167, lng: 84.0167, zoom: 10 },
    'Koraput': { lat: 18.8120, lng: 82.7108, zoom: 10 },
    // Telangana
    'Adilabad': { lat: 19.6700, lng: 78.5300, zoom: 10 },
    'Khammam': { lat: 17.2473, lng: 80.1514, zoom: 10 },
    'Mulugu': { lat: 18.1924, lng: 79.9289, zoom: 10 },
    // Tripura
    'West Tripura': { lat: 23.8315, lng: 91.2868, zoom: 10 },
    'North Tripura': { lat: 24.3167, lng: 92.1667, zoom: 10 },
    'South Tripura': { lat: 23.1667, lng: 91.4333, zoom: 10 },
};

// Generate random coordinates within a bounding box
function randomCoordinate(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

// Generate polygon coordinates for a region
export function generatePolygonCoordinates(center: Coordinates, size: number = 0.05): number[][][] {
    const points = 6; // hexagon
    const coordinates: number[][] = [];

    for (let i = 0; i <= points; i++) {
        const angle = (i / points) * 2 * Math.PI;
        const lat = center.lat + size * Math.cos(angle);
        const lng = center.lng + size * Math.sin(angle);
        coordinates.push([lng, lat]);
    }

    return [coordinates];
}

// Generate IFR (Individual Forest Rights) GeoJSON
export function generateIFRLayer(state?: string, district?: string): GeoJSON.FeatureCollection {
    const features: GeoJSON.Feature[] = [];
    const count = district ? 50 : state ? 200 : 1000;

    let centerCoords: Coordinates;
    if (district && districtCoordinates[district]) {
        centerCoords = districtCoordinates[district];
    } else if (state && stateCoordinates[state]) {
        centerCoords = stateCoordinates[state];
    } else {
        centerCoords = { lat: 20.593684, lng: 78.96288 }; // India center
    }

    for (let i = 0; i < count; i++) {
        const lat = randomCoordinate(centerCoords.lat - 0.5, centerCoords.lat + 0.5);
        const lng = randomCoordinate(centerCoords.lng - 0.5, centerCoords.lng + 0.5);

        const properties: FRAFeatureProperties = {
            id: `IFR-${i + 1}`,
            name: `IFR Parcel ${i + 1}`,
            type: 'IFR',
            state: state || 'Jharkhand',
            district: district || 'Ranchi',
            village: `Village ${Math.floor(i / 10) + 1}`,
            pattaHolderId: `PH-${1000 + i}`,
            pattaHolderName: `Patta Holder ${i + 1}`,
            area: randomCoordinate(0.5, 5),
            claimStatus: ['approved', 'pending', 'filed', 'rejected'][Math.floor(Math.random() * 4)] as any,
            claimDate: `2020-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-15`,
            tribalGroup: ['Munda', 'Oraon', 'Santhal', 'Ho', 'Kharia'][Math.floor(Math.random() * 5)],
        };

        if (properties.claimStatus === 'approved') {
            properties.approvalDate = `2021-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-15`;
        }

        features.push({
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: generatePolygonCoordinates({ lat, lng }, 0.002),
            },
            properties,
        });
    }

    return {
        type: 'FeatureCollection',
        features,
    };
}

// Generate CFR (Community Forest Resources) GeoJSON
export function generateCFRLayer(state?: string, district?: string): GeoJSON.FeatureCollection {
    const features: GeoJSON.Feature[] = [];
    const count = district ? 10 : state ? 40 : 200;

    let centerCoords: Coordinates;
    if (district && districtCoordinates[district]) {
        centerCoords = districtCoordinates[district];
    } else if (state && stateCoordinates[state]) {
        centerCoords = stateCoordinates[state];
    } else {
        centerCoords = { lat: 20.593684, lng: 78.96288 };
    }

    for (let i = 0; i < count; i++) {
        const lat = randomCoordinate(centerCoords.lat - 0.5, centerCoords.lat + 0.5);
        const lng = randomCoordinate(centerCoords.lng - 0.5, centerCoords.lng + 0.5);

        const properties: FRAFeatureProperties = {
            id: `CFR-${i + 1}`,
            name: `CFR Area ${i + 1}`,
            type: 'CFR',
            state: state || 'Jharkhand',
            district: district || 'Ranchi',
            village: `Village ${i + 1}`,
            area: randomCoordinate(10, 100),
            claimStatus: ['approved', 'pending', 'filed'][Math.floor(Math.random() * 3)] as any,
            claimDate: `2019-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-15`,
            tribalGroup: ['Munda', 'Oraon', 'Santhal'][Math.floor(Math.random() * 3)],
        };

        if (properties.claimStatus === 'approved') {
            properties.approvalDate = `2020-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-15`;
        }

        features.push({
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: generatePolygonCoordinates({ lat, lng }, 0.02),
            },
            properties,
        });
    }

    return {
        type: 'FeatureCollection',
        features,
    };
}

// Generate Village Boundaries GeoJSON
export function generateVillageLayer(state?: string, district?: string): GeoJSON.FeatureCollection {
    const features: GeoJSON.Feature[] = [];
    const count = district ? 20 : state ? 100 : 500;

    let centerCoords: Coordinates;
    if (district && districtCoordinates[district]) {
        centerCoords = districtCoordinates[district];
    } else if (state && stateCoordinates[state]) {
        centerCoords = stateCoordinates[state];
    } else {
        centerCoords = { lat: 20.593684, lng: 78.96288 };
    }

    for (let i = 0; i < count; i++) {
        const lat = randomCoordinate(centerCoords.lat - 0.5, centerCoords.lat + 0.5);
        const lng = randomCoordinate(centerCoords.lng - 0.5, centerCoords.lng + 0.5);

        const totalClaims = Math.floor(randomCoordinate(10, 100));
        const approvedClaims = Math.floor(totalClaims * randomCoordinate(0.4, 0.8));
        const pendingClaims = Math.floor((totalClaims - approvedClaims) * randomCoordinate(0.3, 0.7));
        const rejectedClaims = totalClaims - approvedClaims - pendingClaims;

        const properties: VillageFeatureProperties = {
            id: `VILL-${i + 1}`,
            name: `Village ${i + 1}`,
            state: state || 'Jharkhand',
            district: district || 'Ranchi',
            block: `Block ${Math.floor(i / 5) + 1}`,
            population: Math.floor(randomCoordinate(500, 3000)),
            tribalPopulation: Math.floor(randomCoordinate(300, 2500)),
            tribalPercentage: randomCoordinate(60, 95),
            bplPercentage: randomCoordinate(30, 70),
            totalClaims,
            approvedClaims,
            pendingClaims,
            rejectedClaims,
            totalArea: randomCoordinate(100, 1000),
            waterVulnerability: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
            livelihoodVulnerability: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
        };

        features.push({
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: generatePolygonCoordinates({ lat, lng }, 0.01),
            },
            properties,
        });
    }

    return {
        type: 'FeatureCollection',
        features,
    };
}

// Generate Asset Layer GeoJSON
export function generateAssetLayer(state?: string, district?: string): GeoJSON.FeatureCollection {
    const features: GeoJSON.Feature[] = [];
    const assetTypes: Array<'pond' | 'irrigation' | 'road' | 'homestead' | 'school' | 'health' | 'forest'> =
        ['pond', 'irrigation', 'road', 'homestead', 'school', 'health', 'forest'];

    let centerCoords: Coordinates;
    if (district && districtCoordinates[district]) {
        centerCoords = districtCoordinates[district];
    } else if (state && stateCoordinates[state]) {
        centerCoords = stateCoordinates[state];
    } else {
        centerCoords = { lat: 20.593684, lng: 78.96288 };
    }

    assetTypes.forEach((assetType, typeIndex) => {
        const count = district ? 15 : state ? 60 : 300;

        for (let i = 0; i < count; i++) {
            const lat = randomCoordinate(centerCoords.lat - 0.5, centerCoords.lat + 0.5);
            const lng = randomCoordinate(centerCoords.lng - 0.5, centerCoords.lng + 0.5);

            const properties: AssetFeatureProperties = {
                id: `${assetType.toUpperCase()}-${i + 1}`,
                name: `${assetType.charAt(0).toUpperCase() + assetType.slice(1)} ${i + 1}`,
                type: assetType,
                village: `Village ${Math.floor(Math.random() * 20) + 1}`,
                district: district || 'Ranchi',
                state: state || 'Jharkhand',
                condition: ['good', 'fair', 'poor'][Math.floor(Math.random() * 3)] as any,
                year: 2000 + Math.floor(Math.random() * 24),
            };

            if (assetType === 'pond' || assetType === 'irrigation') {
                properties.capacity = randomCoordinate(1000, 50000);
            }

            features.push({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [lng, lat],
                },
                properties,
            });
        }
    });

    return {
        type: 'FeatureCollection',
        features,
    };
}

// Utility to get bounding box from features
export function getBoundingBox(features: GeoJSON.Feature[]): [number, number, number, number] | null {
    if (features.length === 0) return null;

    let minLng = Infinity, minLat = Infinity;
    let maxLng = -Infinity, maxLat = -Infinity;

    features.forEach(feature => {
        if (feature.geometry.type === 'Point') {
            const [lng, lat] = feature.geometry.coordinates;
            minLng = Math.min(minLng, lng);
            minLat = Math.min(minLat, lat);
            maxLng = Math.max(maxLng, lng);
            maxLat = Math.max(maxLat, lat);
        } else if (feature.geometry.type === 'Polygon') {
            feature.geometry.coordinates[0].forEach(([lng, lat]) => {
                minLng = Math.min(minLng, lng);
                minLat = Math.min(minLat, lat);
                maxLng = Math.max(maxLng, lng);
                maxLat = Math.max(maxLat, lat);
            });
        }
    });

    return [minLng, minLat, maxLng, maxLat];
}
