import React from 'react';
import { ClaimRecord } from '@/types/atlas';

interface ClaimPopupProps {
    claim: ClaimRecord;
    onClose: () => void;
}

export default function ClaimPopup({ claim, onClose }: ClaimPopupProps) {
    // Color mapping for claim types
    const typeColors = {
        IFR: 'bg-blue-100 text-blue-800 border-blue-300',
        CR: 'bg-orange-100 text-orange-800 border-orange-300',
        CFR: 'bg-green-100 text-green-800 border-green-300'
    };

    // Color mapping for status
    const statusColors = {
        Approved: 'bg-green-100 text-green-800',
        Pending: 'bg-yellow-100 text-yellow-800',
        Rejected: 'bg-red-100 text-red-800',
        Filed: 'bg-blue-100 text-blue-800'
    };

    return (
        <div className="bg-white rounded-lg shadow-xl w-80 overflow-hidden">
            {/* Header */}
            <div className={`p-3 flex justify-between items-start border-b-2 ${typeColors[claim.claim_type]}`}>
                <div>
                    <h3 className="font-bold text-lg">{claim.claim_id}</h3>
                    <p className="text-xs opacity-90">{claim.claim_type} Claim</p>
                </div>
                <button onClick={onClose} className="hover:opacity-70">
                    <i className="ri-close-line text-xl"></i>
                </button>
            </div>

            <div className="p-4 space-y-3">
                {/* Holder/Community */}
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {claim.claim_type === 'IFR' ? 'Holder Name' : 'Community Name'}
                    </label>
                    <p className="text-sm font-medium text-gray-900">{claim.holder_or_community}</p>
                </div>

                {/* Status */}
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
                    <div className="mt-1">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[claim.status]}`}>
                            {claim.status}
                        </span>
                    </div>
                </div>

                {/* Area */}
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Area</label>
                    <p className="text-sm font-medium text-gray-900">{claim.area_acres} acres</p>
                </div>

                {/* Location */}
                <div className="pt-2 border-t border-gray-200">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</label>
                    <div className="mt-1 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                            <i className="ri-map-pin-line text-gray-400"></i>
                            <span>{claim.village}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <i className="ri-building-line text-gray-400"></i>
                            <span>{claim.district}, {claim.state}</span>
                        </div>
                    </div>
                </div>

                {/* Claim Type Badge */}
                <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                            {claim.claim_type === 'IFR' && 'Individual Forest Rights'}
                            {claim.claim_type === 'CR' && 'Community Rights'}
                            {claim.claim_type === 'CFR' && 'Community Forest Resource Rights'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
