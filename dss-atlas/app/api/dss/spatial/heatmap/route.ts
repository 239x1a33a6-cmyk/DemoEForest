// API Route: Heatmap Data
// Provides heatmap data for vulnerability visualization

import { NextRequest, NextResponse } from 'next/server';
import { mockVillages } from '@/lib/mockData';
import { APIResponse } from '@/types/dss';

interface HeatmapPoint {
    lat: number;
    lng: number;
    intensity: number;
    villageName: string;
    villageId: string;
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const metric = searchParams.get('metric') || 'overall';
        const state = searchParams.get('state');
        const district = searchParams.get('district');

        let villages = mockVillages;

        // Filter by location
        if (state) {
            villages = villages.filter(v => v.state === state);
        }
        if (district) {
            villages = villages.filter(v => v.district === district);
        }

        // Generate heatmap points based on selected metric
        const heatmapData: HeatmapPoint[] = villages.map(village => {
            let intensity = 0;

            switch (metric) {
                case 'water':
                    intensity = village.vulnerabilityScores.water;
                    break;
                case 'livelihood':
                    intensity = village.vulnerabilityScores.livelihood;
                    break;
                case 'ecological':
                    intensity = village.vulnerabilityScores.ecological;
                    break;
                case 'overall':
                default:
                    intensity = village.vulnerabilityScores.overall;
                    break;
            }

            return {
                lat: village.center[0],
                lng: village.center[1],
                intensity: intensity / 100, // Normalize to 0-1
                villageName: village.name,
                villageId: village.id
            };
        });

        return NextResponse.json<APIResponse<HeatmapPoint[]>>({
            success: true,
            data: heatmapData,
            message: `Generated heatmap for ${metric} vulnerability`
        });

    } catch (error) {
        console.error('Error generating heatmap:', error);
        return NextResponse.json<APIResponse<null>>({
            success: false,
            error: 'Failed to generate heatmap data',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
