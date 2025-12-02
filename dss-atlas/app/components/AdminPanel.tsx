// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration

import React, { useState, useEffect } from 'react';

interface Claim {
    id: string;
    claim_id: string;
    claim_type: string;
    village: string;
    district: string;
    state: string;
    area_ha: number;
    confidence: number;
    flags: string[];
    saved_by: string;
    saved_at: string;
    version: number;
}

interface AdminPanelProps {
    isOpen: boolean;
    token: string;
    onClose: () => void;
    onViewClaim: (claimId: string) => void;
}

export default function AdminPanel({ isOpen, token, onClose, onViewClaim }: AdminPanelProps) {
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'saved_at' | 'confidence' | 'claim_id'>('saved_at');

    useEffect(() => {
        if (isOpen && token) {
            fetchClaims();
        }
    }, [isOpen, token]);

    const fetchClaims = async () => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/claims/list', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error('Failed to fetch claims');
            }

            const data = await res.json();
            setClaims(data);
        } catch (err) {
            setError('Failed to load claims');
        } finally {
            setLoading(false);
        }
    };

    const handleViewClaim = async (claimId: string) => {
        onViewClaim(claimId);
    };

    const filteredClaims = claims.filter(claim =>
        claim.claim_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.district.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedClaims = [...filteredClaims].sort((a, b) => {
        if (sortBy === 'saved_at') {
            return new Date(b.saved_at).getTime() - new Date(a.saved_at).getTime();
        } else if (sortBy === 'confidence') {
            return b.confidence - a.confidence;
        } else {
            return a.claim_id.localeCompare(b.claim_id);
        }
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-900 to-emerald-700 p-6 text-white rounded-t-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Admin Panel - Saved Claims
                            </h2>
                            <p className="text-emerald-100 text-sm mt-1">
                                {claims.length} claim{claims.length !== 1 ? 's' : ''} stored
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-emerald-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Controls */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search by claim ID, village, or district..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="saved_at">Sort by Date</option>
                            <option value="confidence">Sort by Confidence</option>
                            <option value="claim_id">Sort by Claim ID</option>
                        </select>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-4">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                            <p className="text-gray-500">Loading claims...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
                            {error}
                        </div>
                    ) : sortedClaims.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p>No claims found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claim ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Area (ha)</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Saved</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Version</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedClaims.map((claim) => (
                                        <tr key={claim.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-mono text-gray-900">{claim.claim_id}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{claim.claim_type}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {claim.village}, {claim.district}
                                                <br />
                                                <span className="text-xs text-gray-500">{claim.state}</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{claim.area_ha.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${claim.confidence >= 0.85 ? 'bg-green-100 text-green-800' :
                                                    claim.confidence >= 0.5 ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {(claim.confidence * 100).toFixed(0)}%
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {new Date(claim.saved_at).toLocaleDateString()}
                                                <br />
                                                <span className="text-xs text-gray-500">
                                                    {new Date(claim.saved_at).toLocaleTimeString()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">v{claim.version}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <button
                                                    onClick={() => handleViewClaim(claim.id)}
                                                    className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-xs font-medium"
                                                >
                                                    View on Map
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
