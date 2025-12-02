import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { generateIFRLayer, generateCFRLayer, generateVillageLayer } from '@/lib/geoJsonData';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const layerType = searchParams.get('type');
    const state = searchParams.get('state') || undefined;
    const district = searchParams.get('district') || undefined;

    try {
        let geoJsonData: GeoJSON.FeatureCollection;

        switch (layerType) {
            case 'ifr':
                geoJsonData = generateIFRLayer(state, district);
                break;
            case 'cfr':
                geoJsonData = generateCFRLayer(state, district);
                break;
            case 'cr':
                // Community Rights - similar to CFR but different properties
                geoJsonData = generateCFRLayer(state, district);
                // Modify type to CR
                geoJsonData.features.forEach(feature => {
                    if (feature.properties) {
                        feature.properties.type = 'CR';
                    }
                });
                break;
            case 'village':
                geoJsonData = generateVillageLayer(state, district);
                break;
            case 'all':
                // Combine all layers
                const ifrData = generateIFRLayer(state, district);
                const cfrData = generateCFRLayer(state, district);
                const villageData = generateVillageLayer(state, district);

                geoJsonData = {
                    type: 'FeatureCollection',
                    features: [
                        ...ifrData.features,
                        ...cfrData.features,
                        ...villageData.features,
                    ],
                };
                break;
            default:
                return NextResponse.json(
                    { error: 'Invalid layer type. Use: ifr, cfr, cr, village, or all' },
                    { status: 400 }
                );
        }

        return NextResponse.json(geoJsonData);
    } catch (error) {
        console.error('Error generating FRA layer data:', error);
        return NextResponse.json(
            { error: 'Failed to generate layer data' },
            { status: 500 }
        );
    }
}
