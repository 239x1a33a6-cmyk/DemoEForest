import { NextResponse, NextRequest } from 'next/server';
import { getDistricts } from '@/lib/mockData';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const stateId = searchParams.get('stateId');

        if (!stateId) {
            return NextResponse.json({ success: false, error: 'State ID is required' }, { status: 400 });
        }

        const districts = getDistricts(stateId);
        return NextResponse.json({ success: true, data: districts });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch districts' }, { status: 500 });
    }
}
