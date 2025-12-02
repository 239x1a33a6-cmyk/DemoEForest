import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { generateAssetLayer } from '@/lib/geoJsonData';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get('state') || undefined;
    const district = searchParams.get('district') || undefined;
    const assetType = searchParams.get('assetType'); // pond, irrigation, road, etc.

    try {
        let geoJsonData = generateAssetLayer(state, district);

        // Filter by asset type if specified
        if (assetType) {
            geoJsonData = {
                type: 'FeatureCollection',
                features: geoJsonData.features.filter(
                    feature => feature.properties?.type === assetType
                ),
            };
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
