import React from 'react';

interface MapLegendProps {
    visible: boolean;
    onClose: () => void;
}

export default function MapLegend({ visible, onClose }: MapLegendProps) {
    if (!visible) return null;

    return (
        <div className="absolute bottom-24 left-4 z-10 bg-white rounded-lg shadow-xl p-4 max-w-xs">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800 text-sm">Map Legend</h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <i className="ri-close-line text-lg"></i>
                </button>
            </div>

            <div className="space-y-3 text-xs">
                {/* FRA Rights */}
                <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Forest Rights</h4>
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full border border-black"></div>
                            <span className="text-gray-600">IFR Claims (Individual)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full border border-black"></div>
                            <span className="text-gray-600">CR Claims (Community)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full border border-black"></div>
                            <span className="text-gray-600">CFR Claims (Resource)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
