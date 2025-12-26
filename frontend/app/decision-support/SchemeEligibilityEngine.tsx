'use client';

import { useState, useEffect } from 'react';
import { EligibilityResult, Beneficiary } from '@/types/dss';

export default function SchemeEligibilityEngine() {
    // Dropdown Data States
    const [states, setStates] = useState<string[]>([]);
    const [districts, setDistricts] = useState<string[]>([]);
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);

    // Selection States
    const [selectedState, setSelectedState] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string>('');

    const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null);
    const [selectedBeneficiaryDetails, setSelectedBeneficiaryDetails] = useState<Beneficiary | null>(null);
    const [loading, setLoading] = useState(false);

    // 1. Fetch States on Mount
    useEffect(() => {
        fetch('/api/states')
            .then(res => res.json())
            .then(data => {
                if (data.success) setStates(data.data);
            })
            .catch(err => console.error('Error fetching states:', err));
    }, []);

    // 2. Fetch Districts when State Changes
    useEffect(() => {
        if (selectedState) {
            fetch(`/api/districts?stateId=${selectedState}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setDistricts(data.data);
                })
                .catch(err => console.error('Error fetching districts:', err));

            // Reset downstream
            setSelectedDistrict('');
            setBeneficiaries([]);
            setSelectedBeneficiaryId('');
            setEligibilityResult(null);
        }
    }, [selectedState]);

    // 3. Fetch Beneficiaries when District Changes
    useEffect(() => {
        if (selectedDistrict) {
            fetch(`/api/beneficiaries?districtId=${selectedDistrict}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setBeneficiaries(data.data);
                })
                .catch(err => console.error('Error fetching beneficiaries:', err));

            // Reset downstream
            setSelectedBeneficiaryId('');
            setEligibilityResult(null);
        }
    }, [selectedDistrict]);

    // 4. Check Eligibility when Beneficiary Selected
    const handleBeneficiaryChange = async (beneficiaryId: string) => {
        setSelectedBeneficiaryId(beneficiaryId);
        if (!beneficiaryId) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/eligibility?beneficiaryId=${beneficiaryId}`);
            const result = await response.json();

            if (result.success) {
                setEligibilityResult(result.data);
                setSelectedBeneficiaryDetails(result.data.beneficiary);
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
                    Hierarchical eligibility verification and scheme mapping
                </p>
            </div>

            {/* Hierarchical Selection */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <i className="ri-filter-3-line text-green-600"></i>
                    Beneficiary Lookup
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* State Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">1. Select State</label>
                        <select
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                        >
                            <option value="">-- Select State --</option>
                            {states.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* District Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">2. Select District</label>
                        <select
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            disabled={!selectedState}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white disabled:bg-gray-100 disabled:text-gray-400"
                        >
                            <option value="">-- Select District --</option>
                            {districts.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    {/* Beneficiary Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">3. Select Beneficiary</label>
                        <select
                            value={selectedBeneficiaryId}
                            onChange={(e) => handleBeneficiaryChange(e.target.value)}
                            disabled={!selectedDistrict}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white disabled:bg-gray-100 disabled:text-gray-400"
                        >
                            <option value="">-- Select Beneficiary --</option>
                            {beneficiaries.map(b => (
                                <option key={b.id} value={b.id}>
                                    {b.name} ({b.pattaId})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center animate-pulse">
                    <i className="ri-loader-4-line text-4xl text-green-600 animate-spin"></i>
                    <p className="mt-2 text-gray-600">Verifying eligibility across schemes...</p>
                </div>
            )}

            {/* Results Panel */}
            {eligibilityResult && selectedBeneficiaryDetails && !loading && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                    {/* Left Column: Beneficiary Profile */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Beneficiary Profile</h3>

                            <div className="mb-4">
                                <div className="text-sm text-gray-500">Name</div>
                                <div className="text-xl font-bold text-gray-800">{selectedBeneficiaryDetails.name}</div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <div className="text-sm text-gray-500">Claim Type</div>
                                    <div className="font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded inline-block mt-1">
                                        {selectedBeneficiaryDetails.pattaType}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Status</div>
                                    <div className="font-semibold text-green-700 bg-green-50 px-2 py-1 rounded inline-block mt-1 flex items-center gap-1">
                                        <i className="ri-checkbox-circle-line"></i> Approved
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tribal Group:</span>
                                    <span className="font-medium">{selectedBeneficiaryDetails.tribalGroup}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Land Size:</span>
                                    <span className="font-medium">{selectedBeneficiaryDetails.landSize} Acres</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">District:</span>
                                    <span className="font-medium">{selectedBeneficiaryDetails.district}</span>
                                </div>
                            </div>
                        </div>

                        {/* Priority Score */}
                        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-6 text-white shadow-md">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="text-purple-200 text-sm font-medium uppercase tracking-wider">Priority Score</div>
                                    <div className="text-4xl font-bold mt-1">{eligibilityResult.priorityScore.toFixed(0)}</div>
                                </div>
                                <i className="ri-bar-chart-groupled-line text-3xl text-purple-200 opacity-80"></i>
                            </div>
                            <p className="text-purple-100 text-sm">
                                High probability for scheme benefits based on vulnerability profile.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Schemes & Gaps */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Eligible Schemes List */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <i className="ri-shield-check-line text-green-600"></i>
                                Eligible Schemes
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {eligibilityResult.eligibleSchemes.slice(0, 4).map((scheme, idx) => (
                                    <div key={idx} className="border border-green-100 bg-green-50/50 rounded-lg p-4 hover:border-green-300 transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-gray-800 text-sm">{scheme.schemeName}</h4>
                                            {scheme.isEnrolled ? (
                                                <i className="ri-checkbox-circle-fill text-green-600 text-lg"></i>
                                            ) : (
                                                <i className="ri-add-circle-line text-blue-600 text-lg cursor-pointer" title="Apply Now"></i>
                                            )}
                                        </div>
                                        <div className="text-xs text-green-800 font-medium mb-1">
                                            {scheme.isEnrolled ? 'Active Enrollemnt' : 'Eligible to Apply'}
                                        </div>
                                        <p className="text-xs text-gray-600">{scheme.reason}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recommendation / Gaps */}
                        {eligibilityResult.enrollmentGaps.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <i className="ri-alert-line text-orange-500"></i>
                                    Recommended Actions (Top 3)
                                </h3>
                                <div className="space-y-3">
                                    {eligibilityResult.enrollmentGaps.slice(0, 3).map((gap, idx) => (
                                        <div key={idx} className="flex items-start gap-4 p-3 rounded-lg border border-orange-100 bg-orange-50">
                                            <div className="bg-orange-100 text-orange-600 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <h5 className="font-semibold text-gray-900 text-sm gap-2 flex items-center">
                                                    Apply for {gap.schemeName}
                                                </h5>
                                                <div className="text-xs text-gray-600 mt-1">{gap.actionRequired}</div>
                                            </div>
                                            <button className="ml-auto text-xs bg-white border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded font-medium text-gray-700 shadow-sm">
                                                Initiate
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
