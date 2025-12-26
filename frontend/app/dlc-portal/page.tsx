
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getClaimsByJurisdiction, updateClaimStatus } from '@/lib/firestore/claims';
import { FRAClaim } from '@/lib/types/fra-workflow';

export default function DLCDashboard() {
    const { user, loading: authLoading } = useAuth();
    const [claims, setClaims] = useState<FRAClaim[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedClaim, setSelectedClaim] = useState<FRAClaim | null>(null);

    useEffect(() => {
        async function fetchTasks() {
            if (user && user.role === 'DLC_MEMBER' && user.district) {
                try {
                    // DLC sees claims in their district
                    const tasks = await getClaimsByJurisdiction('DLC_MEMBER', {
                        district: user.district
                    });
                    setClaims(tasks);
                } catch (error) {
                    console.error("Error fetching DLC tasks", error);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchTasks();
    }, [user]);

    const handleDecision = async (claimId: string, decision: 'APPROVE' | 'REJECT' | 'REMAND') => {
        if (!user) return;

        try {
            let newStatus: any = 'APPROVED_BY_DLC';
            let remarks = 'Approved';

            if (decision === 'APPROVE') newStatus = 'TITLE_ISSUED'; // Direct to Title for simplicity
            if (decision === 'REJECT') newStatus = 'REJECTED';
            if (decision === 'REMAND') newStatus = 'REMANDED_BY_DLC';

            await updateClaimStatus(
                claimId,
                newStatus,
                { uid: user.uid, role: user.role, name: user.displayName },
                `Final Decision: ${decision}`,
                {
                    dlcReview: {
                        reviewDate: new Date().toISOString(),
                        decisionDate: new Date().toISOString(),
                        finalDecision: decision === 'REMAND' ? 'REJECT' : decision, // Schema mismatch correction
                        titleinfo: decision === 'APPROVE' ? {
                            titleNumber: `PATTA/${claimId.substring(0, 8)}`,
                            issueDate: new Date().toISOString(),
                            extentApproved: selectedClaim?.formData.areaClaimed || '0'
                        } : undefined
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

    if (user?.role !== 'DLC_MEMBER') {
        return <div className="p-8 text-red-600">Access Denied. authorized for DLC Members only.</div>;
    }

    return (
        <div className="min-h-screen bg-purple-50 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">DLC Portal</h1>
                    <p className="text-gray-600">District Level Committee | District: {user.district}</p>
                </header>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Claims for Final Approval</h2>
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                            {claims.filter(c => ['FORWARDED_TO_DLC'].includes(c.status)).length} Pending
                        </span>
                    </div>

                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claim ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Village</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
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
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${claim.status === 'TITLE_ISSUED' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                                            {claim.status.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        {(claim.status === 'FORWARDED_TO_DLC') && (
                                            <button
                                                onClick={() => setSelectedClaim(claim)}
                                                className="text-purple-600 hover:text-purple-900"
                                            >
                                                Decide
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Decision Modal */}
            {selectedClaim && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full mx-4 p-6">
                        <h3 className="text-xl font-bold mb-4">Final Decision: #{selectedClaim.id.substring(0, 6)}</h3>

                        <div className="space-y-4 mb-6">
                            <div>
                                <h4 className="font-semibold text-sm text-gray-500">SDLC Recommendation</h4>
                                <p className="text-gray-900 border p-2 rounded bg-gray-50">
                                    {selectedClaim.sdlcReview?.remarks || 'Forwarded by SDLC'}
                                </p>
                            </div>

                            <div className="bg-purple-50 p-4 rounded">
                                <h4 className="font-semibold mb-2 text-purple-800">Final Verification</h4>
                                <p className="text-sm text-gray-700">Ensure all legal requirements are met before issuing title.</p>
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
                                onClick={() => handleDecision(selectedClaim.id, 'REMAND')}
                                className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200"
                            >
                                Remand to SDLC
                            </button>
                            <button
                                onClick={() => handleDecision(selectedClaim.id, 'REJECT')}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => handleDecision(selectedClaim.id, 'APPROVE')}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm"
                            >
                                Issue Title (Patta)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
