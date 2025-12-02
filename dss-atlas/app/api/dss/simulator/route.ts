// API Route: Policy Simulator
// What-if analysis for policy weight adjustments

import { NextRequest, NextResponse } from 'next/server';
import { mockVillages, calculatePriorityScore } from '@/lib/mockData';
import {
    APIResponse,
    SimulationResult,
    VillageSimulationResult,
    PolicyWeights,
    SimulationImpact,
    BudgetReallocation
} from '@/types/dss';

// Default weights
const DEFAULT_WEIGHTS: PolicyWeights = {
    water: 0.4,
    livelihood: 0.3,
    ecological: 0.3
};

// Budget allocation per category (in crores)
const CATEGORY_BUDGETS = {
    water: 100,
    livelihood: 80,
    ecological: 60,
    infrastructure: 50
};

function runSimulation(
    state?: string,
    district?: string,
    weights: PolicyWeights = DEFAULT_WEIGHTS,
    scenarioName: string = 'Custom Scenario'
): SimulationResult {
    // Validate weights sum to 1
    const weightSum = weights.water + weights.livelihood + weights.ecological;
    if (Math.abs(weightSum - 1.0) > 0.01) {
        throw new Error('Weights must sum to 1.0');
    }

    let villages = mockVillages;

    // Filter by location
    if (state) {
        villages = villages.filter(v => v.state === state);
    }
    if (district) {
        villages = villages.filter(v => v.district === district);
    }

    // Calculate original priorities
    const villagesWithOriginal = villages.map(v => ({
        village: v,
        originalPriority: calculatePriorityScore(v, DEFAULT_WEIGHTS),
        originalRank: 0
    }));

    // Sort by original priority and assign ranks
    villagesWithOriginal.sort((a, b) => b.originalPriority - a.originalPriority);
    villagesWithOriginal.forEach((v, index) => {
        v.originalRank = index + 1;
    });

    // Calculate simulated priorities
    const villagesWithSimulated = villagesWithOriginal.map(v => ({
        ...v,
        simulatedPriority: calculatePriorityScore(v.village, weights),
        simulatedRank: 0
    }));

    // Sort by simulated priority and assign new ranks
    villagesWithSimulated.sort((a, b) => b.simulatedPriority - a.simulatedPriority);
    villagesWithSimulated.forEach((v, index) => {
        v.simulatedRank = index + 1;
    });

    // Create simulation results
    const simulationResults: VillageSimulationResult[] = villagesWithSimulated.map(v => ({
        villageId: v.village.id,
        villageName: v.village.name,
        originalPriority: v.originalPriority,
        simulatedPriority: v.simulatedPriority,
        priorityChange: v.simulatedPriority - v.originalPriority,
        rankChange: v.originalRank - v.simulatedRank, // Positive = moved up
        recommendedInterventions: getRecommendedInterventions(v.village, weights)
    }));

    // Calculate impact summary
    const impactSummary = calculateImpactSummary(simulationResults, weights);

    // Get top priority villages (top 10 or 20% whichever is smaller)
    const topCount = Math.min(10, Math.ceil(villages.length * 0.2));
    const topPriorityVillages = villagesWithSimulated
        .slice(0, topCount)
        .map(v => v.village);

    // Calculate budget requirement
    const budgetRequirement = calculateBudgetRequirement(topPriorityVillages, weights);

    return {
        scenarioName,
        weights,
        villages: simulationResults,
        topPriorityVillages,
        impactSummary,
        budgetRequirement
    };
}

function getRecommendedInterventions(village: any, weights: PolicyWeights): string[] {
    const interventions: string[] = [];

    // Water-focused interventions
    if (weights.water > 0.4 && village.vulnerabilityScores.water > 60) {
        interventions.push('Water infrastructure development (check dams, farm ponds)');
        interventions.push('Jal Jeevan Mission implementation');
    }

    // Livelihood-focused interventions
    if (weights.livelihood > 0.35 && village.vulnerabilityScores.livelihood > 60) {
        interventions.push('MGNREGA asset creation');
        if (village.landUse.forest > village.landUse.cultivable) {
            interventions.push('Van Dhan Vikas Kendra establishment');
        } else {
            interventions.push('Agricultural support and PM-KISAN enrollment');
        }
    }

    // Ecological interventions
    if (weights.ecological > 0.35 && village.vulnerabilityScores.ecological > 50) {
        interventions.push('Sustainable forest management');
        interventions.push('Soil conservation measures');
    }

    return interventions.length > 0 ? interventions : ['Maintain current development trajectory'];
}

function calculateImpactSummary(results: VillageSimulationResult[], weights: PolicyWeights): SimulationImpact {
    // Count villages with significant priority changes
    const significantChange = results.filter(r => Math.abs(r.priorityChange) > 5);

    // Calculate average priority change
    const avgPriorityChange = results.reduce((sum, r) => sum + r.priorityChange, 0) / results.length;

    // Find top movers (villages that moved up the most in ranking)
    const topMovers = results
        .filter(r => r.rankChange > 0)
        .sort((a, b) => b.rankChange - a.rankChange)
        .slice(0, 5)
        .map(r => r.villageName);

    // Calculate budget reallocation
    const budgetReallocation = calculateBudgetReallocation(weights);

    return {
        totalVillagesAffected: significantChange.length,
        avgPriorityChange,
        topMovers,
        budgetReallocation
    };
}

function calculateBudgetReallocation(weights: PolicyWeights): BudgetReallocation[] {
    const totalBudget = Object.values(CATEGORY_BUDGETS).reduce((sum, val) => sum + val, 0);

    return [
        {
            category: 'Water Infrastructure',
            originalAllocation: CATEGORY_BUDGETS.water,
            newAllocation: totalBudget * weights.water,
            change: (totalBudget * weights.water) - CATEGORY_BUDGETS.water
        },
        {
            category: 'Livelihood Programs',
            originalAllocation: CATEGORY_BUDGETS.livelihood,
            newAllocation: totalBudget * weights.livelihood,
            change: (totalBudget * weights.livelihood) - CATEGORY_BUDGETS.livelihood
        },
        {
            category: 'Ecological Conservation',
            originalAllocation: CATEGORY_BUDGETS.ecological,
            newAllocation: totalBudget * weights.ecological,
            change: (totalBudget * weights.ecological) - CATEGORY_BUDGETS.ecological
        }
    ];
}

function calculateBudgetRequirement(villages: any[], weights: PolicyWeights): number {
    // Rough estimate: ₹10 lakhs per village for comprehensive development
    const basePerVillage = 1000000; // ₹10 lakhs

    // Adjust based on weights
    const waterMultiplier = weights.water * 1.5; // Water infrastructure is expensive
    const livelihoodMultiplier = weights.livelihood * 1.0;
    const ecologicalMultiplier = weights.ecological * 0.8;

    const avgMultiplier = waterMultiplier + livelihoodMultiplier + ecologicalMultiplier;

    return villages.length * basePerVillage * avgMultiplier;
}

// Preset scenarios
const PRESET_SCENARIOS = {
    'water-focus': {
        name: 'Water Security Focus',
        weights: { water: 0.6, livelihood: 0.25, ecological: 0.15 }
    },
    'livelihood-focus': {
        name: 'Livelihood Enhancement Focus',
        weights: { water: 0.25, livelihood: 0.55, ecological: 0.2 }
    },
    'ecological-focus': {
        name: 'Ecological Conservation Focus',
        weights: { water: 0.2, livelihood: 0.25, ecological: 0.55 }
    },
    'balanced': {
        name: 'Balanced Development',
        weights: { water: 0.33, livelihood: 0.34, ecological: 0.33 }
    }
};

// POST endpoint for running simulations
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { state, district, weights, scenarioName } = body;

        if (!weights) {
            return NextResponse.json<APIResponse<null>>({
                success: false,
                error: 'Weights are required for simulation'
            }, { status: 400 });
        }

        const result = runSimulation(state, district, weights, scenarioName);

        return NextResponse.json<APIResponse<SimulationResult>>({
            success: true,
            data: result,
            message: `Simulation completed for ${result.villages.length} villages`
        });

    } catch (error) {
        console.error('Error running simulation:', error);
        return NextResponse.json<APIResponse<null>>({
            success: false,
            error: 'Failed to run simulation',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// GET endpoint for preset scenarios
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const preset = searchParams.get('preset');
        const state = searchParams.get('state');
        const district = searchParams.get('district');

        if (preset && PRESET_SCENARIOS[preset as keyof typeof PRESET_SCENARIOS]) {
            const scenario = PRESET_SCENARIOS[preset as keyof typeof PRESET_SCENARIOS];
            const result = runSimulation(state || undefined, district || undefined, scenario.weights, scenario.name);

            return NextResponse.json<APIResponse<SimulationResult>>({
                success: true,
                data: result,
                message: `Preset scenario '${scenario.name}' applied`
            });
        }

        // Return available presets
        return NextResponse.json<APIResponse<typeof PRESET_SCENARIOS>>({
            success: true,
            data: PRESET_SCENARIOS,
            message: 'Available preset scenarios'
        });

    } catch (error) {
        console.error('Error retrieving scenarios:', error);
        return NextResponse.json<APIResponse<null>>({
            success: false,
            error: 'Failed to retrieve scenarios',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
