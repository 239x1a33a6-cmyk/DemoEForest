import React, { useState } from 'react';

interface MeasurementToolProps {
    active: boolean;
    onClose: () => void;
    measurements: {
        distance: number; // in km
        area: number; // in sq km
    };
}

export default function MeasurementTool({ active, onClose, measurements }: MeasurementToolProps) {
    const [mode, setMode] = useState<'distance' | 'area'>('distance');

    if (!active) return null;

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 w-64 absolute top-20 right-4 z-20">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <i className="ri-ruler-line text-blue-600"></i>
                    Measurement
                </h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <i className="ri-close-line"></i>
                </button>
            </div>

            <div className="flex bg-gray-100 rounded p-1 mb-4">
                <button
                    onClick={() => setMode('distance')}
                    className={`flex-1 py-1 text-sm rounded transition-colors ${mode === 'distance' ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-800'
                        }`}
                >
                    Distance
                </button>
                <button
                    onClick={() => setMode('area')}
                    className={`flex-1 py-1 text-sm rounded transition-colors ${mode === 'area' ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-800'
                        }`}
                >
                    Area
                </button>
            </div>

            <div className="bg-blue-50 rounded p-3 text-center mb-3">
                {mode === 'distance' ? (
                    <div>
                        <div className="text-xs text-blue-600 uppercase tracking-wider font-semibold mb-1">Total Distance</div>
                        <div className="text-2xl font-bold text-gray-800">
                            {measurements.distance.toFixed(2)} <span className="text-sm font-normal text-gray-500">km</span>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="text-xs text-blue-600 uppercase tracking-wider font-semibold mb-1">Total Area</div>
                        <div className="text-2xl font-bold text-gray-800">
                            {measurements.area.toFixed(2)} <span className="text-sm font-normal text-gray-500">km²</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            ({(measurements.area * 100).toFixed(2)} hectares)
                        </div>
                    </div>
                )}
            </div>

            <p className="text-xs text-gray-500 text-center">
                Click on the map to add points. Double click to finish.
            </p>
        </div>
    );
}
