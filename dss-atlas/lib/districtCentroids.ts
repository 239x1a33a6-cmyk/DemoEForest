// District centroids for placing markers
// Format: [longitude, latitude]
export const districtCentroids: Record<string, [number, number]> = {
    // Telangana
    'Adilabad': [78.5314, 19.6644],
    'Khammam': [80.1514, 17.2473],
    'Bhadradri Kothagudem': [80.6186, 17.5501],
    'Mulugu': [79.9344, 18.1894],

    // Odisha
    'Koraput': [82.7120, 18.8120],
    'Sundargarh': [84.0333, 22.1167],
    'Mayurbhanj': [86.7454, 22.1500],
    'Kandhamal': [84.1333, 20.1667],
    'Rayagada': [83.4167, 19.1667],

    // Madhya Pradesh
    'Mandla': [80.3714, 22.5979],
    'Dindori': [81.0833, 22.9417],
    'Betul': [77.9000, 21.9000],
    'Jhabua': [74.5917, 22.7667],
    'Alirajpur': [74.3597, 22.3056],
    'Barwani': [74.9000, 22.0333],

    // Tripura
    'Dhalai': [91.9333, 23.8333],
    'West Tripura': [91.5333, 23.8333],
    'North Tripura': [92.1667, 24.1333],
    'South Tripura': [91.4333, 23.1667],

    // Jharkhand (for future use)
    'Ranchi': [85.3096, 23.3441],
    'East Singhbhum': [86.2029, 22.5675],
    'West Singhbhum': [85.5833, 22.5833],
    'Gumla': [84.5381, 23.0444],
    'Khunti': [85.2786, 23.0731]
};

// Helper function to get centroid with fallback
export function getDistrictCentroid(district: string): [number, number] | null {
    return districtCentroids[district] || null;
}
