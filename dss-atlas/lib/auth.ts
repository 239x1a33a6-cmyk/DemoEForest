// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12');
const SESSION_DURATION = process.env.ADMIN_SESSION_DURATION || '15m';

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token
 */
export function generateToken(payload: any): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: SESSION_DURATION,
        issuer: 'fra-atlas',
    });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): any {
    try {
        return jwt.verify(token, JWT_SECRET, {
            issuer: 'fra-atlas',
        });
    } catch (error) {
        return null;
    }
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters long' };
    }

    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }

    if (!/[a-z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }

    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one number' };
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one special character' };
    }

    return { valid: true };
}

/**
 * Extract token from Authorization header
 */
export function extractToken(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    return request.headers.get('x-real-ip') || 'unknown';
}
