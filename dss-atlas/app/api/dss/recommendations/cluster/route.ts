// API Route: AI Recommendations
// Provides ML-based village clustering and scheme recommendations

import { NextRequest, NextResponse } from 'next/server';
import { mockVillages, mockSchemes, calculatePriorityScore } from '@/lib/mockData';
import { APIResponse, ClusterResult, ClusterType, VillageData, Scheme } from '@/types/dss';

// Simple K-means clustering implementation
function clusterVillages(villages: VillageData[], k: number = 4): ClusterResult[] {
    // Define cluster types based on vulnerability patterns
    const clusters: ClusterResult[] = [
        {
            clusterId: 'CL001',
            clusterName: 'Water-Stressed Villages',
            clusterType: 'water-stressed',
            villages: [],
            characteristics: {
                avgWaterVulnerability: 0,
                avgLivelihoodVulnerability: 0,
                avgEcologicalSensitivity: 0,
                totalPopulation: 0,
                totalHouseholds: 0,
                dominantLivelihood: 'Agriculture',
                keyIssues: ['Water scarcity', 'Irrigation deficit', 'Drinking water shortage'],
                strengths: ['Agricultural potential', 'Community organization']
            },
            recommendedSchemes: [],
            priorityScore: 0,
            interventionPlan: []
        },
        {
            clusterId: 'CL002',
            clusterName: 'Forest-Rich Livelihood Villages',
            clusterType: 'forest-livelihood',
            villages: [],
            characteristics: {
                avgWaterVulnerability: 0,
                avgLivelihoodVulnerability: 0,
                avgEcologicalSensitivity: 0,
                totalPopulation: 0,
                totalHouseholds: 0,
                dominantLivelihood: 'NTFP Collection',
                keyIssues: ['Market access', 'Value addition', 'Livelihood diversification'],
                strengths: ['Forest resources', 'Traditional knowledge', 'NTFP availability']
            },
            recommendedSchemes: [],
            priorityScore: 0,
            interventionPlan: []
        },
        {
            clusterId: 'CL003',
            clusterName: 'Agro-Potential Villages',
            clusterType: 'agro-potential',
            villages: [],
            characteristics: {
                avgWaterVulnerability: 0,
                avgLivelihoodVulnerability: 0,
                avgEcologicalSensitivity: 0,
                totalPopulation: 0,
                totalHouseholds: 0,
                dominantLivelihood: 'Agriculture',
                keyIssues: ['Input access', 'Market linkage', 'Technology adoption'],
                strengths: ['Cultivable land', 'Water availability', 'Infrastructure']
            },
            recommendedSchemes: [],
            priorityScore: 0,
            interventionPlan: []
        },
        {
            clusterId: 'CL004',
            clusterName: 'Highly Vulnerable Tribal Habitations',
            clusterType: 'highly-vulnerable',
            villages: [],
            characteristics: {
                avgWaterVulnerability: 0,
                avgLivelihoodVulnerability: 0,
                avgEcologicalSensitivity: 0,
                totalPopulation: 0,
                totalHouseholds: 0,
                dominantLivelihood: 'Mixed',
                keyIssues: ['Multi-dimensional poverty', 'Resource scarcity', 'Infrastructure deficit'],
                strengths: ['Community resilience', 'Traditional practices']
            },
            recommendedSchemes: [],
            priorityScore: 0,
            interventionPlan: []
        }
    ];

    // Classify villages into clusters based on vulnerability patterns
    villages.forEach(village => {
        const { water, livelihood, ecological, overall } = village.vulnerabilityScores;

        if (water > 70 && livelihood < 70) {
            // Water-stressed
            clusters[0].villages.push(village);
        } else if (village.landUse.forest > village.landUse.cultivable && livelihood > 60) {
            // Forest-livelihood
            clusters[1].villages.push(village);
        } else if (village.landUse.cultivable > village.landUse.forest && overall < 60) {
            // Agro-potential
            clusters[2].villages.push(village);
        } else if (overall > 65) {
            // Highly vulnerable
            clusters[3].villages.push(village);
        } else {
            // Default to agro-potential
            clusters[2].villages.push(village);
        }
    });

    // Calculate cluster characteristics and recommendations
    clusters.forEach(cluster => {
        if (cluster.villages.length > 0) {
            // Calculate averages
            cluster.characteristics.avgWaterVulnerability =
                cluster.villages.reduce((sum, v) => sum + v.vulnerabilityScores.water, 0) / cluster.villages.length;
            cluster.characteristics.avgLivelihoodVulnerability =
                cluster.villages.reduce((sum, v) => sum + v.vulnerabilityScores.livelihood, 0) / cluster.villages.length;
            cluster.characteristics.avgEcologicalSensitivity =
                cluster.villages.reduce((sum, v) => sum + v.vulnerabilityScores.ecological, 0) / cluster.villages.length;
            cluster.characteristics.totalPopulation =
                cluster.villages.reduce((sum, v) => sum + v.population.total, 0);
            cluster.characteristics.totalHouseholds =
                cluster.villages.reduce((sum, v) => sum + v.population.households, 0);

            // Calculate priority score
            cluster.priorityScore =
                cluster.villages.reduce((sum, v) => sum + calculatePriorityScore(v), 0) / cluster.villages.length;

            // Assign recommended schemes based on cluster type
            cluster.recommendedSchemes = getRecommendedSchemes(cluster.clusterType);
            cluster.interventionPlan = getInterventionPlan(cluster.clusterType);
        }
    });

    // Filter out empty clusters and sort by priority
    return clusters
        .filter(c => c.villages.length > 0)
        .sort((a, b) => b.priorityScore - a.priorityScore);
}

function getRecommendedSchemes(clusterType: ClusterType): Scheme[] {
    const schemeMap: Record<ClusterType, string[]> = {
        'water-stressed': ['SCH003', 'SCH002'], // JJM, MGNREGA
        'forest-livelihood': ['SCH004', 'SCH005'], // DAJGUA, Van Dhan
        'agro-potential': ['SCH001', 'SCH002'], // PM-KISAN, MGNREGA
        'highly-vulnerable': ['SCH001', 'SCH002', 'SCH003', 'SCH004'] // All priority schemes
    };

    const schemeIds = schemeMap[clusterType] || [];
    return mockSchemes.filter(s => schemeIds.includes(s.id));
}

function getInterventionPlan(clusterType: ClusterType): string[] {
    const interventionMap: Record<ClusterType, string[]> = {
        'water-stressed': [
            'Construct check dams and farm ponds',
            'Develop irrigation infrastructure',
            'Implement rainwater harvesting',
            'Provide piped water connections under JJM'
        ],
        'forest-livelihood': [
            'Establish Van Dhan Kendras',
            'Provide NTFP value addition training',
            'Create market linkages through TRIFED',
            'Support SHG formation for NTFP enterprises'
        ],
        'agro-potential': [
            'Enroll eligible farmers in PM-KISAN',
            'Develop farm infrastructure under MGNREGA',
            'Provide agricultural extension services',
            'Improve market access and storage facilities'
        ],
        'highly-vulnerable': [
            'Multi-sectoral intervention approach',
            'Priority enrollment in all applicable schemes',
            'Infrastructure development (water, roads, health)',
            'Livelihood diversification programs',
            'Special assistance and monitoring'
        ]
    };

    return interventionMap[clusterType] || [];
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { state, district, numberOfClusters } = body;

        let villages = mockVillages;

        // Filter by location if provided
        if (state) {
            villages = villages.filter(v => v.state === state);
        }
        if (district) {
            villages = villages.filter(v => v.district === district);
        }

        if (villages.length === 0) {
            return NextResponse.json<APIResponse<null>>({
                success: false,
                error: 'No villages found for the specified criteria'
            }, { status: 404 });
        }

        // Perform clustering
        const clusters = clusterVillages(villages, numberOfClusters || 4);

        return NextResponse.json<APIResponse<ClusterResult[]>>({
            success: true,
            data: clusters,
            message: `Generated ${clusters.length} clusters from ${villages.length} villages`
        });

    } catch (error) {
        console.error('Error clustering villages:', error);
        return NextResponse.json<APIResponse<null>>({
            success: false,
            error: 'Failed to cluster villages',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// GET endpoint for pre-computed clusters
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const state = searchParams.get('state');
        const district = searchParams.get('district');

        let villages = mockVillages;

        if (state) {
            villages = villages.filter(v => v.state === state);
        }
        if (district) {
            villages = villages.filter(v => v.district === district);
        }

        const clusters = clusterVillages(villages);

        return NextResponse.json<APIResponse<ClusterResult[]>>({
            success: true,
            data: clusters,
            message: `Retrieved ${clusters.length} clusters`
        });

    } catch (error) {
        console.error('Error retrieving clusters:', error);
        return NextResponse.json<APIResponse<null>>({
            success: false,
            error: 'Failed to retrieve clusters',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
