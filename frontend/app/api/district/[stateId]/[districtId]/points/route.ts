import { NextRequest, NextResponse } from 'next/server';
import { booleanPointInPolygon, bbox as turfBbox, randomPoint } from '@turf/turf';
import * as fs from 'fs';
import * as path from 'path';

export const dynamic = 'force-dynamic';

// Reuse the state mapping
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

// Helper: random int
function randInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper: generate 20 random claim features inside polygon
function generateSyntheticClaims(polygon: any, districtName: string, stateName: string) {
    const bbox = turfBbox(polygon);
    const features: any[] = [];
    const claimTypes = ["IFR", "CR", "CFR"];

    let attempts = 0;
    while (features.length < 40 && attempts < 1000) {
        attempts++;
        const random = randomPoint(1, { bbox: bbox as any }).features[0];

        // Check if point is inside strictly
        if (!booleanPointInPolygon(random, polygon)) continue;

        const claimType = claimTypes[randInt(0, claimTypes.length - 1)];

        const idNum = String(features.length + 1).padStart(3, "0");
        const claimId = `${stateName?.slice(0, 2).toUpperCase() || "ST"}_${districtName
            ?.slice(0, 3)
            .toUpperCase()}_${claimType}_` + idNum;

        const villageName = `Village_${features.length + 1}`;

        random.properties = {
            ...random.properties,
            claimId,
            claimType, // "IFR" | "CR" | "CFR"
            village: villageName,
            district: districtName,
            state: stateName,
            ifrCount: randInt(10, 80),
            crCount: randInt(5, 40),
            cfrCount: randInt(5, 40),
            status: ["Pending", "Under Review", "Approved", "Rejected", "Title Distributed"][randInt(0, 4)],
        };

        features.push(random);
    }

    return {
        type: "FeatureCollection",
        features,
    };
}

export async function GET(request: NextRequest, { params }: { params: { stateId: string, districtId: string } }) {
    const { stateId, districtId } = params;

    // Decode URL params
    const decodedState = decodeURIComponent(stateId);
    const decodedDistrict = decodeURIComponent(districtId);

    try {
        // Find state file
        const filePrefix = STATE_FILE_MAPPING[decodedState];
        if (!filePrefix) {
            return NextResponse.json({ message: "State not found" }, { status: 404 });
        }

        const geojsonPath = path.join(GEOJSON_BASE, `${filePrefix}.geojson`);

        if (!fs.existsSync(geojsonPath)) {
            return NextResponse.json({ message: "Boundary file not found" }, { status: 404 });
        }

        const geojsonContent = fs.readFileSync(geojsonPath, 'utf-8');
        const stateGeoJson = JSON.parse(geojsonContent);

        // Find district polygon
        const districtFeature = stateGeoJson.features.find((f: any) => {
            const props = f.properties || {};
            const dName = props.dtname || props.district || props.DISTRICT || props.NAME_2 || '';
            return dName.toLowerCase() === decodedDistrict.toLowerCase();
        });

        if (!districtFeature) {
            return NextResponse.json({ message: "District boundary not found" }, { status: 404 });
        }

        const polygon = districtFeature;
        // const districtName = decodedDistrict;
        // const stateName = decodedState;

        // Generate synthetic claims
        const claims = generateSyntheticClaims(polygon, decodedDistrict, decodedState);

        return NextResponse.json({
            boundary: polygon,
            claims: claims
        });

    } catch (error) {
        console.error('Atlas mapping error:', error);
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
}
