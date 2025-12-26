// Map utilities for FRA Atlas

import { Coordinates, BoundingBox } from '@/types/atlas';

// Color palettes for different layer types
export const layerColors = {
    ifr: '#E63946', // Red (High Contrast)
    cr: '#047857', // Darker Green
    cfr: '#2A9D8F', // Teal (High Contrast)
    village: '#3A0CA3', // Purple (High Contrast)
    district: '#DC2626', // Darker Red
    state: '#000000', // Black for state boundaries
    tribal: '#0F766E', // Darker Teal
    asset: {
        pond: '#1E40AF', // Darker Blue
        irrigation: '#0E7490', // Darker Cyan
        road: '#4B5563', // Darker Gray
        homestead: '#D97706', // Darker Orange
        school: '#6B21A8', // Darker Purple
        health: '#DC2626', // Darker Red
        forest: '#047857', // Darker Green
    },
    vulnerability: {
        low: '#047857',
        medium: '#D97706',
        high: '#DC2626',
    },
};

// Generate color based on value (for heatmaps)
export function getHeatmapColor(value: number, min: number = 0, max: number = 100): string {
    const normalized = (value - min) / (max - min);

    if (normalized < 0.33) {
        return layerColors.vulnerability.low;
    } else if (normalized < 0.67) {
        return layerColors.vulnerability.medium;
    } else {
        return layerColors.vulnerability.high;
    }
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(coord2.lat - coord1.lat);
    const dLng = toRad(coord2.lng - coord1.lng);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(coord1.lat)) *
        Math.cos(toRad(coord2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
}

// Calculate area of a polygon (in square kilometers)
export function calculatePolygonArea(coordinates: number[][]): number {
    if (coordinates.length < 3) return 0;

    let area = 0;
    const R = 6371; // Earth's radius in km

    for (let i = 0; i < coordinates.length - 1; i++) {
        const [lng1, lat1] = coordinates[i];
        const [lng2, lat2] = coordinates[i + 1];

        area += toRad(lng2 - lng1) * (2 + Math.sin(toRad(lat1)) + Math.sin(toRad(lat2)));
    }

    area = Math.abs(area * R * R / 2);
    return area;
}

// Convert square kilometers to hectares
export function kmToHectares(km: number): number {
    return km * 100;
}

// Convert square kilometers to acres
export function kmToAcres(km: number): number {
    return km * 247.105;
}

// Get bounding box from coordinates array
export function getBoundingBoxFromCoords(coords: Coordinates[]): BoundingBox {
    const lats = coords.map(c => c.lat);
    const lngs = coords.map(c => c.lng);

    return {
        north: Math.max(...lats),
        south: Math.min(...lats),
        east: Math.max(...lngs),
        west: Math.min(...lngs),
    };
}

// Expand bounding box by a percentage
export function expandBoundingBox(bbox: BoundingBox, percentage: number = 10): BoundingBox {
    const latDiff = bbox.north - bbox.south;
    const lngDiff = bbox.east - bbox.west;
    const latExpand = (latDiff * percentage) / 100;
    const lngExpand = (lngDiff * percentage) / 100;

    return {
        north: bbox.north + latExpand,
        south: bbox.south - latExpand,
        east: bbox.east + lngExpand,
        west: bbox.west - lngExpand,
    };
}

// Check if point is inside bounding box
export function isPointInBounds(point: Coordinates, bbox: BoundingBox): boolean {
    return (
        point.lat >= bbox.south &&
        point.lat <= bbox.north &&
        point.lng >= bbox.west &&
        point.lng <= bbox.east
    );
}

// Format coordinates for display
export function formatCoordinates(coord: Coordinates, decimals: number = 4): string {
    return `${coord.lat.toFixed(decimals)}°N, ${coord.lng.toFixed(decimals)}°E`;
}

// Format area for display
export function formatArea(areaKm: number, unit: 'km' | 'hectares' | 'acres' = 'hectares'): string {
    let value: number;
    let unitStr: string;

    switch (unit) {
        case 'km':
            value = areaKm;
            unitStr = 'km²';
            break;
        case 'hectares':
            value = kmToHectares(areaKm);
            unitStr = 'ha';
            break;
        case 'acres':
            value = kmToAcres(areaKm);
            unitStr = 'acres';
            break;
    }

    return `${value.toFixed(2)} ${unitStr}`;
}

// Format distance for display
export function formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
        return `${(distanceKm * 1000).toFixed(0)} m`;
    }
    return `${distanceKm.toFixed(2)} km`;
}

// Generate layer style for Mapbox
export function generateLayerStyle(layerType: string, opacity: number = 0.7) {
    const baseStyles: any = {
        ifr: {
            'fill-color': layerColors.ifr,
            'fill-opacity': opacity,
            'fill-outline-color': '#1E40AF',
        },
        cr: {
            'fill-color': layerColors.cr,
            'fill-opacity': opacity,
            'fill-outline-color': '#065F46',
        },
        cfr: {
            'fill-color': layerColors.cfr,
            'fill-opacity': opacity,
            'fill-outline-color': '#5B21B6',
        },
        village: {
            'line-color': layerColors.village,
            'line-width': 2,
            'line-opacity': opacity,
        },
        district: {
            'line-color': layerColors.district,
            'line-width': 3,
            'line-opacity': opacity,
        },
        state: {
            'line-color': layerColors.state,
            'line-width': 4,
            'line-opacity': opacity,
        },
    };

    return baseStyles[layerType] || {};
}

// Generate icon for asset type
export function getAssetIcon(assetType: string): string {
    const icons: Record<string, string> = {
        pond: '💧',
        irrigation: '🚰',
        road: '🛣️',
        homestead: '🏠',
        school: '🏫',
        health: '🏥',
        forest: '🌲',
    };

    return icons[assetType] || '📍';
}

// Validate GeoJSON
export function isValidGeoJSON(data: any): boolean {
    try {
        if (!data || typeof data !== 'object') return false;
        if (data.type !== 'FeatureCollection') return false;
        if (!Array.isArray(data.features)) return false;

        return data.features.every((feature: any) => {
            return (
                feature.type === 'Feature' &&
                feature.geometry &&
                feature.geometry.type &&
                feature.geometry.coordinates
            );
        });
    } catch {
        return false;
    }
}
