import { NextResponse, NextRequest } from 'next/server';
import { mockBeneficiaries, mockSchemes, checkEligibility, calculatePriorityScore, getVillageById } from '@/lib/mockData';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const beneficiaryId = searchParams.get('beneficiaryId');

        if (!beneficiaryId) {
            return NextResponse.json({ success: false, error: 'Beneficiary ID is required' }, { status: 400 });
        }

        const beneficiary = mockBeneficiaries.find(b => b.id === beneficiaryId);
        if (!beneficiary) {
            return NextResponse.json({ success: false, error: 'Beneficiary not found' }, { status: 404 });
        }

        // Logic adapted from previous API to match new GET structure
        const eligibleSchemes: any[] = [];
        const enrollmentGaps: any[] = [];
        const recommendations: string[] = [];

        mockSchemes.forEach(scheme => {
            const isEligible = checkEligibility(beneficiary, scheme.id);
            const isEnrolled = beneficiary.enrolledSchemes.includes(scheme.name) || beneficiary.enrolledSchemes.includes(scheme.id);

            if (isEligible) {
                const schemeData = {
                    schemeId: scheme.id,
                    schemeName: scheme.name,
                    isEnrolled: isEnrolled,
                    reason: `Matches criteria: ${scheme.category}`,
                    estimatedBenefit: 10000 // Mock value
                };
                eligibleSchemes.push(schemeData);

                if (!isEnrolled) {
                    enrollmentGaps.push({
                        schemeName: scheme.name,
                        reason: 'Eligible but not enrolled',
                        actionRequired: `Apply via ${scheme.ministry}`
                    });
                }
            }
        });

        // Priority Score
        const village = getVillageById('VIL001'); // Mock fallback as beneficiary doesn't link directly to village object ID in simple mock
        const priorityScore = village ? calculatePriorityScore(village) : 50;

        // Recommendations
        if (enrollmentGaps.length > 0) {
            recommendations.push(`Prioritize enrollment in ${enrollmentGaps[0].schemeName}`);
        }
        if (beneficiary.landSize < 2 && beneficiary.hasCultivableLand) {
            recommendations.push('Consider high-yield crop varieties');
        }

        return NextResponse.json({
            success: true,
            data: {
                beneficiary,
                eligibleSchemes,
                enrollmentGaps,
                priorityScore,
                recommendations
            }
        });

    } catch (error) {
        console.error("Eligibility check error:", error);
        return NextResponse.json({ success: false, error: 'Failed to check eligibility' }, { status: 500 });
    }
}
