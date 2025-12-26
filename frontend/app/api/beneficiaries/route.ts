import { NextResponse, NextRequest } from 'next/server';
import { mockBeneficiaries } from '@/lib/mockData';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const districtId = searchParams.get('districtId');

        if (!districtId) {
            return NextResponse.json({ success: false, error: 'District ID is required' }, { status: 400 });
        }

        const beneficiaries = mockBeneficiaries.filter(b => b.district === districtId);
        return NextResponse.json({ success: true, data: beneficiaries });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch beneficiaries' }, { status: 500 });
    }
}
