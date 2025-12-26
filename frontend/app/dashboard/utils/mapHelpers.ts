// Exact dashboard replication from DashboardModule
import * as turf from '@turf/turf';

export interface ClaimData {
    claim_id: string;
    holder_or_community: string;
    claim_type: string;
    status: string;
    area_acres: number;
    village: string;
    district: string;
    state: string;
    tribal_group: string;
    latitude: number;
    longitude: number;
}

/**
 * Get marker color based on claim status
 */
export function getClaimMarkerColor(status: string): string {
    switch (status.toLowerCase()) {
        case 'approved':
        case 'granted':
            return '#22c55e'; // Green
        case 'pending':
            return '#eab308'; // Yellow
        case 'rejected':
            return '#ef4444'; // Red
        default:
            return '#6b7280'; // Gray
    }
}

/**
 * Calculate polygon area in square kilometers using turf.js
 */
export function calculatePolygonArea(geometry: any): number {
    try {
        const area = turf.area(geometry);
        return area / 1000000; // Convert to sq km
    } catch (error) {
        console.error('Error calculating area:', error);
        return 0;
    }
}

/**
 * Get bounds for a GeoJSON feature
 */
export function getBoundsForFeature(feature: any): [[number, number], [number, number]] | null {
    try {
        const bbox = turf.bbox(feature);
        return [[bbox[1], bbox[0]], [bbox[3], bbox[2]]]; // [southwest, northeast] for Leaflet
    } catch (error) {
        console.error('Error getting bounds:', error);
        return null;
    }
}

/**
 * Filter claims by region (state/district)
 */
export function filterClaimsByRegion(
    claims: ClaimData[],
    state?: string,
    district?: string,
    tribalGroup?: string
): ClaimData[] {
    let filtered = [...claims];

    if (state && state !== 'All States') {
        filtered = filtered.filter(claim => claim.state === state);
    }

    if (district && district !== 'All Districts') {
        filtered = filtered.filter(claim => claim.district === district);
    }

    if (tribalGroup && tribalGroup !== 'All Tribal Groups') {
        filtered = filtered.filter(claim => claim.tribal_group === tribalGroup);
    }

    return filtered;
}

/**
 * Get unique values from array
 */
export function getUniqueValues(arr: string[]): string[] {
    return Array.from(new Set(arr)).sort();
}

/**
 * Calculate statistics from filtered claims
 */
export function calculateClaimStats(claims: ClaimData[], polygonArea?: number) {
    const totalArea = polygonArea || 0;
    const villages = getUniqueValues(claims.map(c => c.village)).length;
    const pattaHolders = claims.length;
    const approved = claims.filter(c => c.status.toLowerCase() === 'approved').length;
    const pending = claims.filter(c => c.status.toLowerCase() === 'pending').length;
    const rejected = claims.filter(c => c.status.toLowerCase() === 'rejected').length;

    return {
        totalArea,
        villages,
        pattaHolders,
        approved,
        pending,
        rejected
    };
}
