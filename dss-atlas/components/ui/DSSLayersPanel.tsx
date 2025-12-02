'use client';

import React from 'react';

interface DSSLayersPanelProps {
    selectedState: string | null;
    setSelectedState: (state: string | null) => void;
    selectedDistrict: string | null;
    setSelectedDistrict: (district: string | null) => void;
    districts: string[];
    showHeatmap: boolean;
    setShowHeatmap: (show: boolean) => void;
}

export default function DSSLayersPanel({
    selectedState,
    setSelectedState,
    selectedDistrict,
    setSelectedDistrict,
    districts,
    showHeatmap,
    setShowHeatmap
}: DSSLayersPanelProps) {
    return (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 z-[1000] min-w-[250px] border border-gray-200">
            <h3 className="text-sm font-bold text-gray-800 mb-3 border-b pb-2">Administrative Selection</h3>

            <div className="space-y-4">
                {/* State Selection */}
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">State</label>
                    <select
                        value={selectedState || ''}
                        onChange={(e) => {
                            const val = e.target.value || null;
                            setSelectedState(val);
                            // Reset district when state changes (handled in parent, but good UX to be explicit)
                            if (val !== selectedState) {
                                setSelectedDistrict(null);
                            }
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    >
                        <option value="">-- Select State --</option>
                        <option value="Andhra Pradesh">Andhra Pradesh (incl. Telangana)</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Orissa">Odisha (Orissa)</option>
                    </select>
                </div>

                {/* District Selection */}
                <div>
                    <label className={`block text-xs font-semibold mb-1 ${!selectedState ? 'text-gray-400' : 'text-gray-600'}`}>
                        District
                    </label>
                    <select
                        value={selectedDistrict || ''}
                        onChange={(e) => setSelectedDistrict(e.target.value || null)}
                        disabled={!selectedState}
                        className={`w-full px-3 py-2 text-sm border rounded-md outline-none transition-all ${!selectedState
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            }`}
                    >
                        <option value="">-- Select District --</option>
                        {districts.map(district => (
                            <option key={district} value={district}>{district}</option>
                        ))}
                    </select>
                </div>

                {/* Village Selection (Future Placeholder) */}
                <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Village (Coming Soon)</label>
                    <select disabled className="w-full px-3 py-2 text-sm border border-gray-200 bg-gray-100 text-gray-400 rounded-md cursor-not-allowed">
                        <option>-- Select Village --</option>
                    </select>
                </div>

                <div className="border-t pt-3 mt-2">
                    <button
                        onClick={() => setShowHeatmap(!showHeatmap)}
                        className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${showHeatmap
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                            }`}
                    >
                        {showHeatmap ? 'Disable DSS Score View' : 'Enable DSS Score View'}
                    </button>
                </div>
            </div>
        </div>
    );
}
