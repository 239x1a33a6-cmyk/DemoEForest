// API Route: Spatial Decision Engine
// Provides village data with spatial information and vulnerability scores

import { NextRequest, NextResponse } from 'next/server';
import {
    mockVillages,
    getVillagesByState,
    getVillagesByDistrict,
    getVillageById,
    calculatePriorityScore
} from '@/lib/mockData';
import { VillageData, APIResponse } from '@/types/dss';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const state = searchParams.get('state');
        const district = searchParams.get('district');
        const block = searchParams.get('block');
        const village = searchParams.get('village');
        const villageId = searchParams.get('id');
        const minVulnerability = searchParams.get('minVulnerability');

        let villages: VillageData[] = mockVillages;

        // Filter by ID if provided
        if (villageId) {
            const foundVillage = getVillageById(villageId);
            return NextResponse.json<APIResponse<VillageData>>({
                success: true,
                data: foundVillage,
                message: foundVillage ? 'Village found' : 'Village not found'
            });
        }

        // Filter by location hierarchy
        if (state) {
            villages = villages.filter(v => v.state === state);
        }
        if (district) {
            villages = villages.filter(v => v.district === district);
        }
        if (block) {
            villages = villages.filter(v => v.block === block);
        }
        if (village) {
            villages = villages.filter(v => v.name === village);
        }

        // Filter by vulnerability threshold
        if (minVulnerability) {
            const threshold = parseFloat(minVulnerability);
            villages = villages.filter(v => v.vulnerabilityScores.overall >= threshold);
        }

        // Calculate priority scores for all villages
        const villagesWithPriority = villages.map(v => ({
            ...v,
            priorityScore: calculatePriorityScore(v)
        }));

        // Sort by priority score (highest first)
        villagesWithPriority.sort((a, b) => b.priorityScore - a.priorityScore);

        return NextResponse.json<APIResponse<VillageData[]>>({
            success: true,
            data: villagesWithPriority,
            message: `Found ${villagesWithPriority.length} villages`
        });

    } catch (error) {
        console.error('Error fetching village data:', error);
        return NextResponse.json<APIResponse<null>>({
            success: false,
            error: 'Failed to fetch village data',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// POST endpoint for bulk village analysis
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { villageIds, weights } = body;

        if (!villageIds || !Array.isArray(villageIds)) {
            return NextResponse.json<APIResponse<null>>({
                success: false,
                error: 'Invalid request: villageIds array required'
            }, { status: 400 });
        }

        const villages = villageIds
            .map(id => getVillageById(id))
            .filter((v): v is VillageData => v !== undefined);

        // Calculate priority scores with custom weights if provided
        const customWeights = weights || { water: 0.4, livelihood: 0.3, ecological: 0.3 };
        const villagesWithPriority = villages.map(v => ({
            ...v,
            priorityScore: calculatePriorityScore(v, customWeights)
        }));

        villagesWithPriority.sort((a, b) => b.priorityScore - a.priorityScore);

        return NextResponse.json<APIResponse<VillageData[]>>({
            success: true,
            data: villagesWithPriority,
            message: `Analyzed ${villagesWithPriority.length} villages`
        });

    } catch (error) {
        console.error('Error analyzing villages:', error);
        return NextResponse.json<APIResponse<null>>({
            success: false,
            error: 'Failed to analyze villages',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
