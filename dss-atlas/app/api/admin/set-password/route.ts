// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/dbSqlite';
import { hashPassword, validatePasswordStrength } from '@/lib/auth';
import { randomUUID } from 'crypto';

/**
 * POST /api/admin/set-password
 * Set the initial admin password (only allowed if no password exists)
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { password, confirm_password } = body;

        // Validate input
        if (!password || !confirm_password) {
            return NextResponse.json(
                { error: 'Password and confirmation are required' },
                { status: 400 }
            );
        }

        if (password !== confirm_password) {
            return NextResponse.json(
                { error: 'Passwords do not match' },
                { status: 400 }
            );
        }

        // Validate password strength
        const strengthCheck = validatePasswordStrength(password);
        if (!strengthCheck.valid) {
            return NextResponse.json(
                { error: strengthCheck.message },
                { status: 400 }
            );
        }

        // Check if password already exists
        const existingAdmin = await query('SELECT COUNT(*) as count FROM admin');
        if (existingAdmin.rows[0].count > 0) {
            return NextResponse.json(
                { error: 'Admin password already set. Use password reset if needed.' },
                { status: 403 }
            );
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Store in database
        await query(
            'INSERT INTO admin (hashed_password, created_at, updated_at) VALUES (?, datetime("now"), datetime("now"))',
            [hashedPassword]
        );

        // Log to audit
        const auditId = randomUUID();
        await query(
            `INSERT INTO audit_log (id, action, user_identifier, success, details, created_at)
            VALUES (?, ?, ?, ?, ?, datetime("now"))`,
            [auditId, 'admin_password_set', 'system', 1, JSON.stringify({ timestamp: new Date() })]
        );

        return NextResponse.json({
            success: true,
            message: 'Admin password set successfully'
        });

    } catch (error) {
        console.error('Error setting admin password:', error);
        return NextResponse.json(
            { error: 'Failed to set admin password' },
            { status: 500 }
        );
    }
}
