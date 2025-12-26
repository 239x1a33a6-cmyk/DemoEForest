import React from 'react';
import { VillagePopupData } from '@/types/atlas';

interface VillagePopupProps {
    data: VillagePopupData;
    onClose: () => void;
    onViewDetails: () => void;
}

export default function VillagePopup({ data, onClose, onViewDetails }: VillagePopupProps) {
    const { village, claims, assets, socioEconomic, schemes } = data;

    return (
        <div className="bg-white rounded-lg shadow-xl w-80 overflow-hidden">
            {/* Header */}
            <div className="bg-green-700 text-white p-3 flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg">{village.name}</h3>
                    <p className="text-xs opacity-90">{village.block}, {village.district}</p>
                </div>
                <button onClick={onClose} className="text-white hover:text-gray-200">
                    <i className="ri-close-line text-xl"></i>
                </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto">
                {/* FRA Claims Stats */}
                <div className="mb-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">FRA Claims Status</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-blue-50 p-2 rounded text-center">
                            <div className="text-lg font-bold text-blue-700">{claims.filed}</div>
                            <div className="text-xs text-gray-600">Total Filed</div>
                        </div>
                        <div className="bg-green-50 p-2 rounded text-center">
                            <div className="text-lg font-bold text-green-700">{claims.approved}</div>
                            <div className="text-xs text-gray-600">Approved</div>
                        </div>
                        <div className="bg-yellow-50 p-2 rounded text-center">
                            <div className="text-lg font-bold text-yellow-700">{claims.pending}</div>
                            <div className="text-xs text-gray-600">Pending</div>
                        </div>
                        <div className="bg-red-50 p-2 rounded text-center">
                            <div className="text-lg font-bold text-red-700">{claims.rejected}</div>
                            <div className="text-xs text-gray-600">Rejected</div>
                        </div>
                    </div>
                </div>

                {/* Socio-Economic Snapshot */}
                <div className="mb-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Demographics</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Population:</span>
                            <span className="font-medium">{socioEconomic.population}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tribal Population:</span>
                            <span className="font-medium">{socioEconomic.tribalPopulation} ({Math.round(socioEconomic.tribalPopulation / socioEconomic.population * 100)}%)</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">BPL Households:</span>
                            <span className="font-medium">{socioEconomic.bplPercentage}%</span>
                        </div>
                    </div>
                </div>

                {/* Assets */}
                <div className="mb-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Village Assets</h4>
                    <div className="flex gap-3 text-center">
                        <div className="flex-1">
                            <div className="text-xl">💧</div>
                            <div className="text-xs font-medium">{assets.ponds} Ponds</div>
                        </div>
                        <div className="flex-1">
                            <div className="text-xl">🚰</div>
                            <div className="text-xs font-medium">{assets.irrigation} Irrigation</div>
                        </div>
                        <div className="flex-1">
                            <div className="text-xl">🛣️</div>
                            <div className="text-xs font-medium">{assets.roads} Roads</div>
                        </div>
                    </div>
                </div>

                {/* Scheme Eligibility */}
                <div className="mb-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Scheme Eligibility</h4>
                    <div className="flex flex-wrap gap-1">
                        {schemes.eligible.map(scheme => (
                            <span key={scheme} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                                {scheme}
                            </span>
                        ))}
                        {schemes.eligible.length === 0 && (
                            <span className="text-xs text-gray-500 italic">No eligible schemes found</span>
                        )}
                    </div>
                </div>

                <button
                    onClick={onViewDetails}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    View Full Details
                </button>
            </div>
        </div>
    );
}
