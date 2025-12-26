
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getClaimsByJurisdiction, updateClaimStatus } from '@/lib/firestore/claims';
import { FRAClaim } from '@/lib/types/fra-workflow';

export default function FRCDashboard() {
    const { user, loading: authLoading } = useAuth();
    const [claims, setClaims] = useState<FRAClaim[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedClaim, setSelectedClaim] = useState<FRAClaim | null>(null);

    useEffect(() => {
        async function fetchTasks() {
            if (user && user.role === 'FRC_MEMBER' && user.village && user.district) {
                try {
                    // FRC sees claims in their village
                    const tasks = await getClaimsByJurisdiction('FRC_MEMBER', {
                        village: user.village,
                        district: user.district
                    });
                    setClaims(tasks);
                } catch (error) {
                    console.error("Error fetching FRC tasks", error);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchTasks();
    }, [user]);

    const handleVerify = async (claimId: string, decision: 'APPROVE' | 'REJECT') => {
        if (!user) return;

        // In real app, we would upload Site Inspection Report and Gram Sabha Resolution
        try {
            await updateClaimStatus(
                claimId,
                decision === 'APPROVE' ? 'FORWARDED_TO_SDLC' : 'REJECTED',
                { uid: user.uid, role: user.role, name: user.displayName },
                `Claim ${decision === 'APPROVE' ? 'verified and passed' : 'rejected'} by Gram Sabha`,
                {
                    gramSabhaResolution: {
                        meetingDate: new Date().toISOString(),
                        resolutionNumber: `RES/${Date.now()}`,
                        quorumPresent: true,
                        decision: decision
                    }
                }
            );
            // Optimistic update or refresh
            setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: decision === 'APPROVE' ? 'FORWARDED_TO_SDLC' : 'REJECTED' } : c));
            setSelectedClaim(null);
        } catch (e) {
            alert("Error updating status");
        }
    };

    if (authLoading || loading) return <div className="p-8">Loading Portal...</div>;

    if (user?.role !== 'FRC_MEMBER') {
        return <div className="p-8 text-red-600">Access Denied. authorized for FRC Members only.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Gram Sabha / FRC Portal</h1>
                    <p className="text-gray-600">Village: {user.village}, District: {user.district}</p>
                </header>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Pending Verifications</h2>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {claims.filter(c => c.status === 'SUBMITTED_TO_GRAM_SABHA').length} Pending
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claimant</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {claims.map((claim) => (
                                    <tr key={claim.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{claim.id.substring(0, 6)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {claim.claimantName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {claim.type}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${claim.status === 'SUBMITTED_TO_GRAM_SABHA' ? 'bg-yellow-100 text-yellow-800' :
                                                    claim.status === 'GRAM_SABHA_RESOLUTION_PASSED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {claim.status.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => setSelectedClaim(claim)}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                Review
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {claims.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No claims found for your jurisdiction.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Verification Modal */}
            {selectedClaim && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto p-6">
                        <h3 className="text-xl font-bold mb-4">Verify Claim #{selectedClaim.id.substring(0, 6)}</h3>

                        <div className="space-y-4 mb-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm text-gray-500">Claimant</span>
                                    <p className="font-medium">{selectedClaim.claimantName}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Area Claimed</span>
                                    <p className="font-medium">{selectedClaim.formData.areaClaimed || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded">
                                <h4 className="font-semibold mb-2">Verification Checklist</h4>
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" className="rounded text-blue-600" />
                                    <span>Claimant has occupied land before 2005</span>
                                </label>
                                <label className="flex items-center space-x-2 mt-2">
                                    <input type="checkbox" className="rounded text-blue-600" />
                                    <span>Boundaries verified by neighbors</span>
                                </label>
                                <label className="flex items-center space-x-2 mt-2">
                                    <input type="checkbox" className="rounded text-blue-600" />
                                    <span>Gram Sabha resolution passed unanimously</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setSelectedClaim(null)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleVerify(selectedClaim.id, 'REJECT')}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => handleVerify(selectedClaim.id, 'APPROVE')}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Approve & Forward to SDLC
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
