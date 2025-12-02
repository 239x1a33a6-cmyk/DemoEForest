'use client';

/**
 * Props for MapLegend component
 */
interface MapLegendProps {
    selectedState: string | null;
}

/**
 * MapLegend Component
 * 
 * Displays a legend for the map showing:
 * - State colors
 * - Vulnerability scale
 * - FRA marker types
 */
export default function MapLegend({ selectedState }: MapLegendProps) {
    return (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[1000] max-w-[250px]">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Map Legend</h4>

            {/* State Color */}
            {selectedState && (
                <div className="mb-3 pb-3 border-b border-gray-200">
                    <p className="text-xs font-medium text-gray-700 mb-2">State Boundary</p>
                    <div className="flex items-center gap-2">
                        <div
                            className="w-6 h-4 rounded border-2 border-black"
                            style={{
                                backgroundColor: getStateColorForLegend(selectedState),
                                opacity: 0.4
                            }}
                        />
                        <span className="text-xs text-gray-600">{selectedState}</span>
                    </div>
                </div>
            )}

            {/* Vulnerability Scale */}
            <div className="mb-3 pb-3 border-b border-gray-200">
                <p className="text-xs font-medium text-gray-700 mb-2">Vulnerability Score</p>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#22c55e' }} />
                        <span className="text-xs text-gray-600">Low (0-49)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#eab308' }} />
                        <span className="text-xs text-gray-600">Medium (50-74)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#dc2626' }} />
                        <span className="text-xs text-gray-600">High (75-100)</span>
                    </div>
                </div>
            </div>

            {/* FRA Patta Markers */}
            <div>
                <p className="text-xs font-medium text-gray-700 mb-2">FRA Patta Types</p>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow"
                            style={{ backgroundColor: '#3b82f6' }}
                        >
                            I
                        </div>
                        <span className="text-xs text-gray-600">Individual Forest Rights</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow"
                            style={{ backgroundColor: '#10b981' }}
                        >
                            C
                        </div>
                        <span className="text-xs text-gray-600">Community Forest Rights</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Get state color for legend display
 */
function getStateColorForLegend(stateName: string): string {
    const colors: Record<string, string> = {
        'Telangana': '#FF5733',
        'Madhya Pradesh': '#1E90FF',
        'Jharkhand': '#28A745',
        'Tripura': '#9B59B6'
    };
    return colors[stateName] || '#808080';
}
