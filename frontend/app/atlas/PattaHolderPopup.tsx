import React from 'react';
import { PattaHolderPopupData } from '@/types/atlas';

interface PattaHolderPopupProps {
    data: PattaHolderPopupData;
    onClose: () => void;
    onViewDetails: () => void;
}

export default function PattaHolderPopup({ data, onClose, onViewDetails }: PattaHolderPopupProps) {
    const { id, name, village, district, tribalGroup, landParcels, totalArea, schemes } = data;

    return (
        <div className="bg-white rounded-lg shadow-xl w-80 overflow-hidden">
            {/* Header */}
            <div className="bg-blue-700 text-white p-3 flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg">{name}</h3>
                    <p className="text-xs opacity-90">ID: {id} | {tribalGroup}</p>
                </div>
                <button onClick={onClose} className="text-white hover:text-gray-200">
                    <i className="ri-close-line text-xl"></i>
                </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto">
                {/* Location */}
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                    <i className="ri-map-pin-line"></i>
                    <span>{village}, {district}</span>
                </div>

                {/* Land Parcels */}
                <div className="mb-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Land Rights ({totalArea.toFixed(2)} acres)</h4>
                    <div className="space-y-2">
                        {landParcels.map((parcel) => (
                            <div key={parcel.id} className="bg-gray-50 p-2 rounded border border-gray-100">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-sm text-gray-800">{parcel.type} Claim</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${parcel.claimStatus === 'approved' ? 'bg-green-100 text-green-700' :
                                            parcel.claimStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                parcel.claimStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'
                                        }`}>
                                        {parcel.claimStatus.charAt(0).toUpperCase() + parcel.claimStatus.slice(1)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Area: {parcel.area.toFixed(2)} acres</span>
                                    <span>{parcel.claimDate}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scheme Eligibility */}
                <div className="mb-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Eligible Schemes</h4>
                    <div className="flex flex-wrap gap-1">
                        {schemes.eligible.map(scheme => (
                            <span key={scheme} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium flex items-center gap-1">
                                <i className="ri-check-line"></i> {scheme}
                            </span>
                        ))}
                        {schemes.eligible.length === 0 && (
                            <span className="text-xs text-gray-500 italic">No eligible schemes found</span>
                        )}
                    </div>
                </div>

                {/* Applied Schemes */}
                {schemes.applied.length > 0 && (
                    <div className="mb-4">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Applied Schemes</h4>
                        <div className="flex flex-wrap gap-1">
                            {schemes.applied.map(scheme => (
                                <span key={scheme} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium flex items-center gap-1">
                                    <i className="ri-time-line"></i> {scheme}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    onClick={onViewDetails}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    View Full Profile
                </button>
            </div>
        </div>
    );
}
