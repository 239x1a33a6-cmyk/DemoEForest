
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getClaimsByJurisdiction, updateClaimStatus } from '@/lib/firestore/claims';
import { FRAClaim } from '@/lib/types/fra-workflow';

export default function SDLCDashboard() {
    const { user, loading: authLoading } = useAuth();
    const [claims, setClaims] = useState<FRAClaim[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedClaim, setSelectedClaim] = useState<FRAClaim | null>(null);

    useEffect(() => {
        async function fetchTasks() {
            if (user && user.role === 'SDLC_MEMBER' && user.district) {
                try {
                    // SDLC sees claims in their district (conceptually subdivision, but using district filter provided by service)
                    const tasks = await getClaimsByJurisdiction('SDLC_MEMBER', {
                        district: user.district
                    });
                    setClaims(tasks);
                } catch (error) {
                    console.error("Error fetching SDLC tasks", error);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchTasks();
    }, [user]);

    const handleReview = async (claimId: string, decision: 'FORWARD' | 'REMAND') => {
        if (!user) return;

        try {
            const newStatus = decision === 'FORWARD' ? 'FORWARDED_TO_DLC' : 'REMANDED_BY_SDLC';

            await updateClaimStatus(
                claimId,
                newStatus,
                { uid: user.uid, role: user.role, name: user.displayName },
                decision === 'FORWARD' ? 'Verified and forwarded to DLC' : 'Remanded back to Gram Sabha for correction',
                {
                    sdlcReview: {
                        reviewDate: new Date().toISOString(),
                        reviewerId: user.uid,
                        decision: decision,
                        remarks: decision === 'FORWARD' ? 'Recommended for approval' : 'Discrepancy in area map'
                    }
                }
            );

            setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: newStatus } : c));
            setSelectedClaim(null);
        } catch (e) {
            alert("Error updating status");
        }
    };

    if (authLoading || loading) return <div className="p-8">Loading Portal...</div>;

    if (user?.role !== 'SDLC_MEMBER') {
        return <div className="p-8 text-red-600">Access Denied. authorized for SDLC Members only.</div>;
    }

    return (
        <div className="min-h-screen bg-orange-50 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">SDLC Portal</h1>
                    <p className="text-gray-600">Sub-Division Committee | District: {user.district}</p>
                </header>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Claims for Review</h2>
                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                            {claims.filter(c => ['FORWARDED_TO_SDLC', 'REMANDED_BY_DLC'].includes(c.status)).length} Pending
                        </span>
                    </div>

                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claim ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Village</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {claims.map((claim) => (
                                <tr key={claim.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium">#{claim.id.substring(0, 6)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{claim.village}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{claim.type}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800`}>
                                            {claim.status.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <button
                                            onClick={() => setSelectedClaim(claim)}
                                            className="text-orange-600 hover:text-orange-900"
                                        >
                                            Process
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Review Modal */}
            {selectedClaim && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full mx-4 p-6">
                        <h3 className="text-xl font-bold mb-4">SDLC Review: #{selectedClaim.id.substring(0, 6)}</h3>

                        <div className="space-y-4 mb-6">
                            <div>
                                <h4 className="font-semibold text-sm text-gray-500">Gram Sabha Resolution</h4>
                                <p className="text-gray-900 border p-2 rounded bg-gray-50">
                                    Resolution Passed on {selectedClaim.gramSabhaResolution?.meetingDate ? selectedClaim.gramSabhaResolution.meetingDate.split('T')[0] : 'Unknown Date'}
                                </p>
                            </div>

                            <div className="bg-orange-50 p-4 rounded">
                                <h4 className="font-semibold mb-2 text-orange-800">Review Checklist</h4>
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" className="rounded text-orange-600" />
                                    <span>No disputes reported</span>
                                </label>
                                <label className="flex items-center space-x-2 mt-2">
                                    <input type="checkbox" className="rounded text-orange-600" />
                                    <span>Boundaries match cadastral maps</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setSelectedClaim(null)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleReview(selectedClaim.id, 'REMAND')}
                                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                            >
                                Remand to Gram Sabha
                            </button>
                            <button
                                onClick={() => handleReview(selectedClaim.id, 'FORWARD')}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                            >
                                Forward to DLC
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
