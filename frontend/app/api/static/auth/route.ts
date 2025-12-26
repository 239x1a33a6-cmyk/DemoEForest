// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/static/auth
 * Authenticate for static dataset access
 * Uses a simple hardcoded password for demo purposes
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { password } = body;

        if (!password) {
            return NextResponse.json(
                { success: false, error: 'Password is required' },
                { status: 400 }
            );
        }

        // For now, use a simple password (open123)
        // In production, this should be stored securely in environment variables
        const STATIC_PASSWORD = process.env.STATIC_DATASET_PASSWORD || 'open123';

        if (password === STATIC_PASSWORD) {
            return NextResponse.json({
                success: true,
                message: 'Access granted to static dataset'
            });
        } else {
            return NextResponse.json(
                { success: false, error: 'Invalid password' },
                { status: 401 }
            );
        }

    } catch (error) {
        console.error('Error in static auth:', error);
        return NextResponse.json(
            { success: false, error: 'Authentication failed' },
            { status: 500 }
        );
    }
}
