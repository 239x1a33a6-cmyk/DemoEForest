'use client';

import { useState } from 'react';
import { EligibilityResult, Beneficiary } from '@/types/dss';
import { mockBeneficiaries } from '@/lib/mockData';

export default function SchemeEligibilityEngine() {
    const [selectedBeneficiary, setSelectedBeneficiary] = useState<string>('');
    const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null);
    const [loading, setLoading] = useState(false);

    const checkEligibility = async () => {
        if (!selectedBeneficiary) return;

        setLoading(true);
        try {
            const response = await fetch('/api/dss/eligibility/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ beneficiaryId: selectedBeneficiary })
            });

            const result = await response.json();
            if (result.success) {
                setEligibilityResult(result.data);
            }
        } catch (error) {
            console.error('Error checking eligibility:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <i className="ri-checkbox-circle-line text-3xl"></i>
                    <h2 className="text-2xl font-bold">Scheme Eligibility Checker</h2>
                </div>
                <p className="text-green-100">
                    Rule-based eligibility assessment and enrollment gap analysis
                </p>
            </div>

            {/* Beneficiary Selection */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Select Beneficiary</h3>
                <div className="flex gap-4">
                    <select
                        value={selectedBeneficiary}
                        onChange={(e) => setSelectedBeneficiary(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                        <option value="">-- Select a beneficiary --</option>
                        {mockBeneficiaries.map(b => (
                            <option key={b.id} value={b.id}>
                                {b.name} - {b.village}, {b.district}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={checkEligibility}
                        disabled={!selectedBeneficiary || loading}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <i className="ri-loader-4-line animate-spin"></i>
                                Checking...
                            </span>
                        ) : (
                            'Check Eligibility'
                        )}
                    </button>
                </div>
            </div>

            {/* Results */}
            {eligibilityResult && (
                <div className="space-y-6">
                    {/* Summary */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Eligibility Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-3xl font-bold text-green-600">{eligibilityResult.eligibleSchemes.length}</div>
                                <div className="text-sm text-gray-600 mt-1">Eligible Schemes</div>
                            </div>
                            <div className="text-center p-4 bg-orange-50 rounded-lg">
                                <div className="text-3xl font-bold text-orange-600">{eligibilityResult.enrollmentGaps.length}</div>
                                <div className="text-sm text-gray-600 mt-1">Enrollment Gaps</div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <div className="text-3xl font-bold text-purple-600">{eligibilityResult.priorityScore.toFixed(0)}</div>
                                <div className="text-sm text-gray-600 mt-1">Priority Score</div>
                            </div>
                        </div>
                    </div>

                    {/* Eligible Schemes */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Eligible Schemes</h3>
                        <div className="space-y-4">
                            {eligibilityResult.eligibleSchemes.map((scheme) => (
                                <div
                                    key={scheme.schemeId}
                                    className={`border-2 rounded-lg p-4 ${scheme.isEnrolled
                                            ? 'border-green-200 bg-green-50'
                                            : 'border-orange-200 bg-orange-50'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{scheme.schemeName}</h4>
                                            <p className="text-sm text-gray-600 mt-1">{scheme.reason}</p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${scheme.isEnrolled
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-orange-600 text-white'
                                                }`}
                                        >
                                            {scheme.isEnrolled ? 'Enrolled' : 'Not Enrolled'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Estimated Benefit:</span>
                                        <span className="font-semibold text-green-600">₹{scheme.estimatedBenefit.toLocaleString()}/year</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Enrollment Gaps */}
                    {eligibilityResult.enrollmentGaps.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <i className="ri-alert-line text-orange-600"></i>
                                Enrollment Gaps - Action Required
                            </h3>
                            <div className="space-y-3">
                                {eligibilityResult.enrollmentGaps.map((gap, idx) => (
                                    <div key={idx} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">{gap.schemeName}</h4>
                                                <p className="text-sm text-gray-600 mt-1">{gap.reason}</p>
                                                <p className="text-sm text-orange-700 mt-2 font-medium">
                                                    <i className="ri-arrow-right-line"></i> {gap.actionRequired}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recommendations */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <i className="ri-lightbulb-line text-green-600"></i>
                            AI Recommendations
                        </h3>
                        <ul className="space-y-2">
                            {eligibilityResult.recommendations.map((rec, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                                    <i className="ri-check-line text-green-600 mt-0.5"></i>
                                    <span>{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
