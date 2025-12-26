import { NextResponse } from 'next/server';
import { getStates } from '@/lib/mockData';

export async function GET() {
    try {
        const states = getStates();
        return NextResponse.json({ success: true, data: states });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch states' }, { status: 500 });
    }
}
