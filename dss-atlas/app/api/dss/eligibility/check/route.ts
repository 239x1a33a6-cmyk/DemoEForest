// API Route: Eligibility Checker
// Rule-based eligibility assessment for scheme enrollment

import { NextRequest, NextResponse } from 'next/server';
import { mockBeneficiaries, mockSchemes, checkEligibility } from '@/lib/mockData';
import { APIResponse, EligibilityResult, SchemeEligibility, SchemeGap, Beneficiary } from '@/types/dss';

function assessEligibility(beneficiary: Beneficiary): EligibilityResult {
    const eligibleSchemes: SchemeEligibility[] = [];
    const enrollmentGaps: SchemeGap[] = [];

    mockSchemes.forEach(scheme => {
        const isEligible = checkEligibility(beneficiary, scheme.id);
        const isEnrolled = beneficiary.enrolledSchemes.includes(scheme.name);

        if (isEligible) {
            eligibleSchemes.push({
                schemeId: scheme.id,
                schemeName: scheme.name,
                isEligible: true,
                isEnrolled: isEnrolled,
                reason: getEligibilityReason(beneficiary, scheme.id),
                estimatedBenefit: getEstimatedBenefit(scheme.id),
                applicationSteps: scheme.applicationProcess
            });

            // If eligible but not enrolled, it's a gap
            if (!isEnrolled) {
                enrollmentGaps.push({
                    schemeId: scheme.id,
                    schemeName: scheme.name,
                    reason: 'Eligible but not enrolled',
                    actionRequired: `Apply for ${scheme.name} through ${getApplicationChannel(scheme.id)}`
                });
            }
        }
    });

    // Calculate priority score based on gaps and vulnerability
    const priorityScore = calculateBeneficiaryPriority(beneficiary, enrollmentGaps.length);

    // Generate recommendations
    const recommendations = generateRecommendations(beneficiary, enrollmentGaps);

    return {
        beneficiaryId: beneficiary.id,
        beneficiaryName: beneficiary.name,
        eligibleSchemes,
        enrollmentGaps,
        priorityScore,
        recommendations
    };
}

function getEligibilityReason(beneficiary: Beneficiary, schemeId: string): string {
    switch (schemeId) {
        case 'SCH001': // PM-KISAN
            return `Has ${beneficiary.landSize} hectares of cultivable land`;
        case 'SCH002': // MGNREGA
            return beneficiary.hasJobCard ? 'Has valid job card' : 'Rural household willing to work';
        case 'SCH003': // JJM
            return 'Household without piped water connection';
        case 'SCH004': // DAJGUA
            return `Belongs to ${beneficiary.tribalGroup} tribal group with NTFP access`;
        case 'SCH005': // Van Dhan
            return `${beneficiary.tribalGroup} tribal member engaged in NTFP collection`;
        default:
            return 'Meets eligibility criteria';
    }
}

function getEstimatedBenefit(schemeId: string): number {
    const benefits: Record<string, number> = {
        'SCH001': 6000, // PM-KISAN annual benefit
        'SCH002': 20000, // MGNREGA estimated annual earning
        'SCH003': 15000, // JJM infrastructure value
        'SCH004': 25000, // DAJGUA enterprise support
        'SCH005': 30000 // Van Dhan value addition benefit
    };
    return benefits[schemeId] || 0;
}

function getApplicationChannel(schemeId: string): string {
    const channels: Record<string, string> = {
        'SCH001': 'PM-KISAN portal or Common Service Center',
        'SCH002': 'Gram Panchayat office',
        'SCH003': 'Village Water and Sanitation Committee',
        'SCH004': 'Tribal Welfare Department',
        'SCH005': 'TRIFED or Van Dhan Vikas Kendra'
    };
    return channels[schemeId] || 'District administration office';
}

function calculateBeneficiaryPriority(beneficiary: Beneficiary, gapCount: number): number {
    let score = 0;

    // Income-based priority (lower income = higher priority)
    if (beneficiary.householdIncome < 50000) score += 30;
    else if (beneficiary.householdIncome < 100000) score += 20;
    else score += 10;

    // Enrollment gap priority
    score += gapCount * 15;

    // Land ownership
    if (beneficiary.landSize > 0) score += 10;

    // Water access
    if (!beneficiary.hasPipedWater) score += 15;

    // NTFP access (livelihood opportunity)
    if (beneficiary.hasNTFPAccess) score += 10;

    return Math.min(score, 100); // Cap at 100
}

function generateRecommendations(beneficiary: Beneficiary, gaps: SchemeGap[]): string[] {
    const recommendations: string[] = [];

    if (gaps.length === 0) {
        recommendations.push('All eligible schemes enrolled. Monitor benefit delivery.');
        return recommendations;
    }

    // Prioritize recommendations based on beneficiary profile
    if (gaps.some(g => g.schemeId === 'SCH003') && !beneficiary.hasPipedWater) {
        recommendations.push('URGENT: Apply for Jal Jeevan Mission for piped water connection');
    }

    if (gaps.some(g => g.schemeId === 'SCH001') && beneficiary.hasCultivableLand) {
        recommendations.push('HIGH PRIORITY: Enroll in PM-KISAN for direct income support of ₹6000/year');
    }

    if (gaps.some(g => g.schemeId === 'SCH002') && !beneficiary.hasJobCard) {
        recommendations.push('Apply for MGNREGA job card for guaranteed employment');
    }

    if (gaps.some(g => ['SCH004', 'SCH005'].includes(g.schemeId)) && beneficiary.hasNTFPAccess) {
        recommendations.push('Join Van Dhan Vikas Kendra or DAJGUA for NTFP-based livelihood enhancement');
    }

    if (beneficiary.householdIncome < 50000) {
        recommendations.push('Eligible for priority support due to low household income');
    }

    return recommendations;
}

// POST endpoint for individual eligibility check
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { beneficiaryId, beneficiaryData } = body;

        let beneficiary: Beneficiary | undefined;

        if (beneficiaryId) {
            beneficiary = mockBeneficiaries.find(b => b.id === beneficiaryId);
        } else if (beneficiaryData) {
            beneficiary = beneficiaryData as Beneficiary;
        }

        if (!beneficiary) {
            return NextResponse.json<APIResponse<null>>({
                success: false,
                error: 'Beneficiary not found or invalid data provided'
            }, { status: 404 });
        }

        const result = assessEligibility(beneficiary);

        return NextResponse.json<APIResponse<EligibilityResult>>({
            success: true,
            data: result,
            message: `Found ${result.eligibleSchemes.length} eligible schemes with ${result.enrollmentGaps.length} enrollment gaps`
        });

    } catch (error) {
        console.error('Error checking eligibility:', error);
        return NextResponse.json<APIResponse<null>>({
            success: false,
            error: 'Failed to check eligibility',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// GET endpoint for bulk eligibility gaps analysis
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const village = searchParams.get('village');
        const district = searchParams.get('district');
        const state = searchParams.get('state');

        let beneficiaries = mockBeneficiaries;

        // Filter beneficiaries
        if (village) {
            beneficiaries = beneficiaries.filter(b => b.village === village);
        }
        if (district) {
            beneficiaries = beneficiaries.filter(b => b.district === district);
        }
        if (state) {
            beneficiaries = beneficiaries.filter(b => b.state === state);
        }

        // Assess all beneficiaries
        const results = beneficiaries.map(b => assessEligibility(b));

        // Calculate summary statistics
        const totalGaps = results.reduce((sum, r) => sum + r.enrollmentGaps.length, 0);
        const avgGapsPerBeneficiary = totalGaps / results.length;
        const highPriorityBeneficiaries = results.filter(r => r.priorityScore > 70).length;

        return NextResponse.json<APIResponse<{
            results: EligibilityResult[];
            summary: {
                totalBeneficiaries: number;
                totalGaps: number;
                avgGapsPerBeneficiary: number;
                highPriorityBeneficiaries: number;
            };
        }>>({
            success: true,
            data: {
                results,
                summary: {
                    totalBeneficiaries: results.length,
                    totalGaps,
                    avgGapsPerBeneficiary,
                    highPriorityBeneficiaries
                }
            },
            message: `Analyzed ${results.length} beneficiaries`
        });

    } catch (error) {
        console.error('Error analyzing eligibility gaps:', error);
        return NextResponse.json<APIResponse<null>>({
            success: false,
            error: 'Failed to analyze eligibility gaps',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
