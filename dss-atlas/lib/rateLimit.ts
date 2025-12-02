// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
// In production, use Redis or similar distributed cache

interface RateLimitEntry {
    attempts: number;
    firstAttempt: number;
    blockedUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Check if IP is rate limited
 */
export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const entry = rateLimitStore.get(ip);

    if (!entry) {
        // First attempt
        rateLimitStore.set(ip, {
            attempts: 1,
            firstAttempt: now
        });
        return { allowed: true };
    }

    // Check if blocked
    if (entry.blockedUntil && entry.blockedUntil > now) {
        const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000);
        return { allowed: false, retryAfter };
    }

    // Check if window has expired
    if (now - entry.firstAttempt > WINDOW_MS) {
        // Reset window
        rateLimitStore.set(ip, {
            attempts: 1,
            firstAttempt: now
        });
        return { allowed: true };
    }

    // Increment attempts
    entry.attempts++;

    if (entry.attempts > MAX_ATTEMPTS) {
        // Block the IP
        entry.blockedUntil = now + BLOCK_DURATION_MS;
        const retryAfter = Math.ceil(BLOCK_DURATION_MS / 1000);
        return { allowed: false, retryAfter };
    }

    return { allowed: true };
}

/**
 * Reset rate limit for IP (e.g., after successful login)
 */
export function resetRateLimit(ip: string): void {
    rateLimitStore.delete(ip);
}

/**
 * Clean up old entries (call periodically)
 */
export function cleanupRateLimitStore(): void {
    const now = Date.now();
    for (const [ip, entry] of rateLimitStore.entries()) {
        if (entry.blockedUntil && entry.blockedUntil < now) {
            rateLimitStore.delete(ip);
        } else if (now - entry.firstAttempt > WINDOW_MS * 2) {
            rateLimitStore.delete(ip);
        }
    }
}

// Clean up every hour
setInterval(cleanupRateLimitStore, 60 * 60 * 1000);
