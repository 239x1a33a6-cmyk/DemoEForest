import React, { useState } from 'react';
import { AnalyticsData } from '@/types/atlas';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsDashboardProps {
    data: AnalyticsData;
    onClose: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AnalyticsDashboard({ data, onClose }: AnalyticsDashboardProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'claims' | 'vulnerability'>('overview');

    // Prepare data for charts
    const claimsStatusData = [
        { name: 'Approved', value: data.overview.approvedClaims, color: '#10B981' },
        { name: 'Pending', value: data.overview.pendingClaims, color: '#F59E0B' },
        { name: 'Rejected', value: data.overview.rejectedClaims, color: '#EF4444' },
    ];

    const claimsByTypeData = [
        { name: 'IFR', value: data.byType.ifr.count, area: data.byType.ifr.area },
        { name: 'CFR', value: data.byType.cfr.count, area: data.byType.cfr.area },
        { name: 'CR', value: data.byType.cr.count, area: data.byType.cr.area },
    ];

    const vulnerabilityData = [
        { name: 'Water (High)', value: data.vulnerability.waterHigh, color: '#EF4444' },
        { name: 'Water (Med)', value: data.vulnerability.waterMedium, color: '#F59E0B' },
        { name: 'Livelihood (High)', value: data.vulnerability.livelihoodHigh, color: '#EF4444' },
        { name: 'Livelihood (Med)', value: data.vulnerability.livelihoodMedium, color: '#F59E0B' },
    ];

    return (
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <i className="ri-dashboard-line"></i>
                    FRA Implementation Analytics
                </h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <i className="ri-close-line text-2xl"></i>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-6 py-3 font-medium text-sm ${activeTab === 'overview'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('claims')}
                    className={`px-6 py-3 font-medium text-sm ${activeTab === 'claims'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Claims Analysis
                </button>
                <button
                    onClick={() => setActiveTab('vulnerability')}
                    className={`px-6 py-3 font-medium text-sm ${activeTab === 'vulnerability'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Vulnerability & DSS
                </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <div className="text-sm text-blue-600 font-medium mb-1">Total Claims</div>
                                <div className="text-2xl font-bold text-gray-800">{data.overview.totalClaims.toLocaleString()}</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                <div className="text-sm text-green-600 font-medium mb-1">Total Area (ha)</div>
                                <div className="text-2xl font-bold text-gray-800">{data.overview.totalArea.toLocaleString()}</div>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                <div className="text-sm text-purple-600 font-medium mb-1">Beneficiaries</div>
                                <div className="text-2xl font-bold text-gray-800">{data.overview.totalBeneficiaries.toLocaleString()}</div>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                                <div className="text-sm text-orange-600 font-medium mb-1">Pending %</div>
                                <div className="text-2xl font-bold text-gray-800">
                                    {Math.round((data.overview.pendingClaims / data.overview.totalClaims) * 100)}%
                                </div>
                            </div>
                        </div>

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-80">
                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-700 mb-4">Claims Status Distribution</h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={claimsStatusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {claimsStatusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-700 mb-4">Claims by Type</h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={claimsByTypeData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="value" name="Number of Claims" fill="#3B82F6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'claims' && (
                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm h-96">
                            <h3 className="text-sm font-bold text-gray-700 mb-4">State-wise Performance</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.byState} layout="vertical" margin={{ left: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="state" type="category" width={100} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="approved" name="Approved" stackId="a" fill="#10B981" />
                                    <Bar dataKey="claims" name="Total Claims" stackId="a" fill="#E5E7EB" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {activeTab === 'vulnerability' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-700 mb-4">Water Vulnerability</h3>
                                <div className="flex items-center justify-center h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={[
                                            { name: 'High', value: data.vulnerability.waterHigh, fill: '#EF4444' },
                                            { name: 'Medium', value: data.vulnerability.waterMedium, fill: '#F59E0B' },
                                            { name: 'Low', value: data.vulnerability.waterLow, fill: '#10B981' },
                                        ]}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="value" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-700 mb-4">Livelihood Vulnerability</h3>
                                <div className="flex items-center justify-center h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={[
                                            { name: 'High', value: data.vulnerability.livelihoodHigh, fill: '#EF4444' },
                                            { name: 'Medium', value: data.vulnerability.livelihoodMedium, fill: '#F59E0B' },
                                            { name: 'Low', value: data.vulnerability.livelihoodLow, fill: '#10B981' },
                                        ]}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="value" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
