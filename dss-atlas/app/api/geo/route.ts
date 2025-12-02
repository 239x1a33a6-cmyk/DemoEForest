import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

// Base path for GeoJSON files
const GEOJSON_BASE = path.join(process.cwd(), 'public', 'geojson', 'states');

// Map state names to their specific file prefixes
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

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get('state');
    const district = searchParams.get('district');

    if (!state) {
        return NextResponse.json({ error: 'State parameter is required' }, { status: 400 });
    }

    const filePrefix = STATE_FILE_MAPPING[state];
    if (!filePrefix) {
        return NextResponse.json({ error: 'State not found or mapping missing' }, { status: 404 });
    }

    const geojsonPath = path.join(GEOJSON_BASE, `${filePrefix}.geojson`);

    try {
        // Check if file exists
        if (!fs.existsSync(geojsonPath)) {
            console.error(`File not found: ${geojsonPath}`);
            return NextResponse.json({ error: 'GeoJSON file not found on server' }, { status: 404 });
        }

        // Read and parse GeoJSON file
        const geojsonContent = fs.readFileSync(geojsonPath, 'utf-8');
        const geojson = JSON.parse(geojsonContent);

        let features = geojson.features || [];

        // Filter by district if provided
        if (district) {
            features = features.filter((f: any) => {
                const props = f.properties || {};
                const districtName = props.dtname || props.district || props.DISTRICT || props.NAME_2 || '';
                return districtName.toLowerCase() === district.toLowerCase();
            });

            if (features.length === 0) {
                console.log(`No features found for district: ${district}`);
                console.log(`Available districts:`, geojson.features.map((f: any) => f.properties?.dtname).filter(Boolean).slice(0, 5));
            }
        }

        console.log(`Serving ${features.length} features for ${state}${district ? ` / ${district}` : ''}`);

        return NextResponse.json({
            type: 'FeatureCollection',
            features: features
        });

    } catch (error) {
        console.error('Error processing GeoJSON:', error);
        return NextResponse.json({
            error: 'Failed to process GeoJSON',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
