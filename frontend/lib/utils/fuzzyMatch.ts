// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
/**
 * Fuzzy string matching for duplicate detection
 */

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix: number[][] = [];

    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,      // deletion
                matrix[i][j - 1] + 1,      // insertion
                matrix[i - 1][j - 1] + cost // substitution
            );
        }
    }

    return matrix[len1][len2];
}

/**
 * Calculate similarity score between two strings (0 to 1)
 */
export function calculateSimilarity(str1: string, str2: string): number {
    const normalized1 = str1.toLowerCase().trim();
    const normalized2 = str2.toLowerCase().trim();

    if (normalized1 === normalized2) return 1.0;

    const maxLen = Math.max(normalized1.length, normalized2.length);
    if (maxLen === 0) return 1.0;

    const distance = levenshteinDistance(normalized1, normalized2);
    return 1 - (distance / maxLen);
}

/**
 * Check if two claims are duplicates based on text similarity
 */
export function isDuplicateText(
    claim1: { name?: string; village?: string; district?: string },
    claim2: { name?: string; village?: string; district?: string },
    threshold: number = 0.9
): boolean {
    // Compare name + village + district concatenation
    const text1 = `${claim1.name || ''} ${claim1.village || ''} ${claim1.district || ''}`.trim();
    const text2 = `${claim2.name || ''} ${claim2.village || ''} ${claim2.district || ''}`.trim();

    if (!text1 || !text2) return false;

    const similarity = calculateSimilarity(text1, text2);
    return similarity >= threshold;
}

/**
 * Calculate distance between two coordinates in meters
 */
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371000; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

/**
 * Check if two claims are duplicates based on coordinate proximity
 */
export function isDuplicateCoordinates(
    claim1: { lat: number | null; lon: number | null },
    claim2: { lat: number | null; lon: number | null },
    thresholdMeters: number = 10
): boolean {
    if (!claim1.lat || !claim1.lon || !claim2.lat || !claim2.lon) {
        return false;
    }

    const distance = calculateDistance(claim1.lat, claim1.lon, claim2.lat, claim2.lon);
    return distance <= thresholdMeters;
}

/**
 * Check if claims are clustered (within proximity)
 */
export function areClustered(
    claim1: { lat: number | null; lon: number | null },
    claim2: { lat: number | null; lon: number | null },
    thresholdMeters: number = 50
): boolean {
    if (!claim1.lat || !claim1.lon || !claim2.lat || !claim2.lon) {
        return false;
    }

    const distance = calculateDistance(claim1.lat, claim1.lon, claim2.lat, claim2.lon);
    return distance <= thresholdMeters;
}
