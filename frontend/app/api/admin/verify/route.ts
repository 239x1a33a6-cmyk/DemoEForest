// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/dbSqlite';
import { verifyPassword, generateToken, getClientIP } from '@/lib/auth';
import { checkRateLimit, resetRateLimit } from '@/lib/rateLimit';
import { randomUUID } from 'crypto';

/**
 * POST /api/admin/verify
 * Verify admin password and return JWT token
 */
export async function POST(request: NextRequest) {
    const ip = getClientIP(request);

    try {
        // Check rate limit
        const rateCheck = checkRateLimit(ip);
        if (!rateCheck.allowed) {
            // Log failed attempt
            const auditId = randomUUID();
            await query(
                `INSERT INTO audit_log (id, action, user_identifier, ip_address, success, details, created_at)
                VALUES (?, ?, ?, ?, ?, ?, datetime("now"))`,
                [
                    auditId,
                    'admin_login_attempt',
                    'admin',
                    ip,
                    0, // false
                    JSON.stringify({ reason: 'rate_limited', retryAfter: rateCheck.retryAfter })
                ]
            );

            return NextResponse.json(
                {
                    error: 'Too many failed attempts. Please try again later.',
                    retryAfter: rateCheck.retryAfter
                },
                { status: 429 }
            );
        }

        const body = await request.json();

        const password = typeof body === 'object' && body !== null && 'password' in body ? (body as any).password : undefined;

        if (!password) {
            return NextResponse.json(
                { error: 'Password is required' },
                { status: 400 }
            );
        }

        // Get stored password hash
        const adminResult = await query('SELECT hashed_password FROM admin LIMIT 1');

        if (adminResult.rows.length === 0) {
            return NextResponse.json(
                { error: 'Admin password not set. Please set password first.' },
                { status: 404 }
            );
        }

        const { hashed_password } = adminResult.rows[0];


        // Verify password
        const isValid = await verifyPassword(password, hashed_password);

        if (!isValid) {
            // Log failed attempt
            const auditId = randomUUID();
            await query(
                `INSERT INTO audit_log (id, action, user_identifier, ip_address, success, details, created_at)
                VALUES (?, ?, ?, ?, ?, ?, datetime("now"))`,
                [auditId, 'admin_login_attempt', 'admin', ip, 0, JSON.stringify({ reason: 'invalid_password' })]
            );

            return NextResponse.json(
                { error: 'Invalid password' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = generateToken({
            role: 'admin',
            ip,
            timestamp: Date.now()
        });

        // Calculate expiry (15 minutes from now)
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

        // Reset rate limit on successful login
        resetRateLimit(ip);

        // Log successful login
        const auditId = randomUUID();
        await query(
            `INSERT INTO audit_log (id, action, user_identifier, ip_address, success, details, created_at)
            VALUES (?, ?, ?, ?, ?, ?, datetime("now"))`,
            [auditId, 'admin_login_attempt', 'admin', ip, 1, JSON.stringify({ timestamp: new Date() })]
        );

        return NextResponse.json({
            success: true,
            token,
            expires_at: expiresAt
        });

    } catch (error) {
        console.error('Error verifying admin password:', error);

        // Log error
        const auditId = randomUUID();
        await query(
            `INSERT INTO audit_log (id, action, user_identifier, ip_address, success, details, created_at)
            VALUES (?, ?, ?, ?, ?, ?, datetime("now"))`,
            [auditId, 'admin_login_attempt', 'admin', ip, 0, JSON.stringify({ error: String(error) })]
        );

        return NextResponse.json(
            { error: 'Failed to verify password' },
            { status: 500 }
        );
    }
}
