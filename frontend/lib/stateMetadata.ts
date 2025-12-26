/**
 * State Metadata for WebGIS Visualization
 * Contains state-specific information including colors, district counts, and FRA data
 */

export interface StateMetadata {
    name: string;
    fullName: string;
    color: string;
    districtCount: number;
    fraHolders: number;
    priorityVillages: number;
    center: [number, number]; // [lat, lng]
}

/**
 * State metadata mapping
 * Keys are state names as they appear in the GeoJSON (NAME_1 property)
 */
export const stateMetadata: Record<string, StateMetadata> = {
    'Telangana': {
        name: 'Telangana',
        fullName: 'Telangana',
        color: '#FF5733', // Red-Orange
        districtCount: 33,
        fraHolders: 12500,
        priorityVillages: 12,
        center: [18.1124, 79.0193]
    },
    'Madhya Pradesh': {
        name: 'Madhya Pradesh',
        fullName: 'Madhya Pradesh',
        color: '#1E90FF', // Dodger Blue
        districtCount: 52,
        fraHolders: 45000,
        priorityVillages: 28,
        center: [22.9734, 78.6569]
    },
    'Jharkhand': {
        name: 'Jharkhand',
        fullName: 'Jharkhand',
        color: '#28A745', // Green
        districtCount: 24,
        fraHolders: 35000,
        priorityVillages: 18,
        center: [23.6102, 85.2799]
    },
    'Tripura': {
        name: 'Tripura',
        fullName: 'Tripura',
        color: '#9B59B6', // Purple
        districtCount: 8,
        fraHolders: 8500,
        priorityVillages: 6,
        center: [23.9408, 91.9882]
    }
};

/**
 * Get state metadata by name
 */
export function getStateMetadata(stateName: string): StateMetadata | undefined {
    return stateMetadata[stateName];
}

/**
 * Get state color by name
 */
export function getStateColor(stateName: string): string {
    return stateMetadata[stateName]?.color || '#808080'; // Default gray
}

/**
 * Check if state is supported
 */
export function isSupportedState(stateName: string): boolean {
    return stateName in stateMetadata;
}

/**
 * Get all supported state names
 */
export function getSupportedStates(): string[] {
    return Object.keys(stateMetadata);
}
