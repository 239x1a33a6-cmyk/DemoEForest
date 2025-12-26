import { NextRequest, NextResponse } from 'next/server';
import { generateAssetLayer } from '@/lib/geoJsonData';
import * as fs from 'fs';
import * as path from 'path';
import { booleanPointInPolygon } from '@turf/turf';

export const dynamic = 'force-dynamic';

// Reuse the state mapping from geo/route.ts
const STATE_FILE_MAPPING: Record<string, string> = {
    'Jammu and Kashmir': 'India_District_01_JK',
    'Himachal Pradesh': 'India_District_02_HP',
    'Punjab': 'India_District_03_PB',
    'Chandigarh': 'India_District_04_CH',
    'Uttarakhand': 'India_District_05_UT',
    'Haryana': 'India_District_06_HR',
    'Delhi': 'India_District_07_DL',
    'Rajasthan': 'India_District_08_RJ',
    'Uttar Pradesh': 'India_District_09_UP',
    'Bihar': 'India_District_10_BR',
    'Sikkim': 'India_District_11_SK',
    'Arunachal Pradesh': 'India_District_12_AR',
    'Nagaland': 'India_District_13_NL',
    'Manipur': 'India_District_14_MN',
    'Mizoram': 'India_District_15_MZ',
    'Tripura': 'India_District_16_TR',
    'Meghalaya': 'India_District_17_ML',
    'Assam': 'India_District_18_AS',
    'West Bengal': 'India_District_19_WB',
    'Jharkhand': 'India_District_20_JH',
    'Odisha': 'India_District_21_OR',
    'Chhattisgarh': 'India_District_22_CT',
    'Madhya Pradesh': 'India_District_23_MP',
    'Gujarat': 'India_District_24_GJ',
    'Daman and Diu': 'India_District_25_DD',
    'Dadra and Nagar Haveli': 'India_District_26_DN',
    'Maharashtra': 'India_District_27_MH',
    'Andhra Pradesh': 'India_District_28_AP',
    'Karnataka': 'India_District_29_KA',
    'Goa': 'India_District_30_GA',
    'Lakshadweep': 'India_District_31_LD',
    'Kerala': 'India_District_32_KL',
    'Tamil Nadu': 'India_District_33_TN',
    'Puducherry': 'India_District_34_PY',
    'Andaman and Nicobar Islands': 'India_District_35_AN',
    'Telangana': 'India_District_36_TG',
    'Ladakh': 'India_District_37_LA'
};

const GEOJSON_BASE = path.join(process.cwd(), 'public', 'geojson', 'states');

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get('state') || undefined;
    const district = searchParams.get('district') || undefined;
    const assetType = searchParams.get('assetType'); // pond, irrigation, road, etc.

    try {
        // 1. Fetch Boundary for filtering
        let filterBoundary: any = null;
        let districtFeature: any = null;

        if (state && STATE_FILE_MAPPING[state]) {
            const filePrefix = STATE_FILE_MAPPING[state];
            const geojsonPath = path.join(GEOJSON_BASE, `${filePrefix}.geojson`);

            if (fs.existsSync(geojsonPath)) {
                const geojsonContent = fs.readFileSync(geojsonPath, 'utf-8');
                const stateGeoJson = JSON.parse(geojsonContent);

                if (district) {
                    // Find district polygon
                    districtFeature = stateGeoJson.features.find((f: any) => {
                        const props = f.properties || {};
                        const dName = props.dtname || props.district || props.DISTRICT || props.NAME_2 || '';
                        return dName.toLowerCase() === district.toLowerCase();
                    });
                    if (districtFeature) {
                        filterBoundary = districtFeature;
                    }
                }
            }
        }

        // 2. Generate Initial Points
        let geoJsonData = generateAssetLayer(state, district);
        let rawPoints = geoJsonData.features;

        // 3. Fallback Logic & Spatial Validation
        // If we are in District mode, we MUST filter.
        if (district && filterBoundary) {
            // Validate generated points
            let validPoints = rawPoints.filter((point) => {
                if (point.geometry.type !== 'Point') return false;
                try {
                    return booleanPointInPolygon(point as any, filterBoundary);
                } catch (e) { return false; }
            }).map((point, index) => {
                // Map generic asset to Claim
                const assetTypes = ['IFR', 'CR', 'CFR'];
                const type = assetTypes[index % assetTypes.length];
                return {
                    ...point,
                    properties: {
                        ...point.properties,
                        claimType: type,
                        type: type,
                        status: ["Pending", "Under Review", "Approved", "Rejected", "Title Distributed"][index % 5],
                        name: `Claim ${point.properties?.id || index}`
                    }
                };
            });

            // 4. Enforce Minimum 40 Points Fallback (Bottom Region / Southern Side)
            if (validPoints.length < 40) {
                console.log(`[Backend] District ${district} has only ${validPoints.length} points. Generating southern-region fallback points to reach 40...`);

                // Calculate BBox of the district polygon
                let minX = 180, minY = 90, maxX = -180, maxY = -90;

                const processCoords = (coords: any[]) => {
                    coords.forEach(coord => {
                        if (Array.isArray(coord[0])) {
                            processCoords(coord); // Recursive for MultiPolygon/Rings
                        } else {
                            const [lng, lat] = coord;
                            if (lng < minX) minX = lng;
                            if (lng > maxX) maxX = lng;
                            if (lat < minY) minY = lat;
                            if (lat > maxY) maxY = lat;
                        }
                    });
                };

                if (filterBoundary.geometry && filterBoundary.geometry.coordinates) {
                    processCoords(filterBoundary.geometry.coordinates);
                }

                // Define Lower (South) BBox - Bottom 25%
                const height = maxY - minY;
                const lowerMaxY = minY + (height * 0.25);

                const assetTypes = ['IFR', 'CR', 'CFR'];
                let attempts = 0;

                // Generate points until we have 40 or max attempts reached
                while (validPoints.length < 40 && attempts < 1000) {
                    attempts++;
                    // Random point in Lower BBox
                    const lng = minX + Math.random() * (maxX - minX);
                    const lat = minY + Math.random() * (lowerMaxY - minY);

                    const type = assetTypes[Math.floor(Math.random() * assetTypes.length)];

                    const point = {
                        type: 'Feature' as const,
                        geometry: { type: 'Point' as const, coordinates: [lng, lat] },
                        properties: {
                            id: `FALLBACK-SOUTH-${attempts}`,
                            name: `Claim ${validPoints.length + 1}`,
                            claimType: type, // Schema match
                            type: type, // Legacy support
                            district: district,
                            state: state,
                            status: ["Pending", "Under Review", "Approved", "Rejected", "Title Distributed"][Math.floor(Math.random() * 5)],
                            year: 2024
                        }
                    };

                    try {
                        if (booleanPointInPolygon(point as any, filterBoundary)) {
                            validPoints.push(point);
                        }
                    } catch (e) { }
                }
                console.log(`[Backend] Final point count for ${district}: ${validPoints.length} (Attempts: ${attempts})`);
            }

            geoJsonData.features = validPoints;
        }

        // Filter by asset type if specified
        if (assetType) {
            geoJsonData.features = geoJsonData.features.filter(
                feature => feature.properties?.type === assetType
            );
        }

        return NextResponse.json(geoJsonData);
    } catch (error) {
        console.error('Error generating asset layer data:', error);
        return NextResponse.json(
            { error: 'Failed to generate asset layer data' },
            { status: 500 }
        );
    }
}
