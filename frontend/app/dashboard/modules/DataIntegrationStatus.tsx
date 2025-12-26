// Exact dashboard replication from DashboardModule
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import governmentTheme from '../theme/governmentTheme';

const COLORS = [
    governmentTheme.colors.primary[500],
    governmentTheme.colors.secondary[500],
    governmentTheme.colors.accent[500],
    '#FF8042'
];

export default function DataIntegrationStatus() {
    const { t } = useTranslation();
    // Mock real-time data
    const digitizationStats = {
        legacyFilesScanned: 125000,
        claimsExtracted: 98000,
        geotaggedPattas: 45000,
        aiAccuracy: 94.5
    };

    const stateProgress = [
        { name: 'Odisha', digitized: 85, pending: 15 },
        { name: 'Chhattisgarh', digitized: 72, pending: 28 },
        { name: 'Jharkhand', digitized: 65, pending: 35 },
        { name: 'MP', digitized: 58, pending: 42 },
        { name: 'Maharashtra', digitized: 45, pending: 55 },
    ];

    const verificationStatus = [
        { name: t('dashboard.integration.verified'), value: 65 },
        { name: t('dashboard.integration.pendingFieldVisit'), value: 25 },
        { name: t('dashboard.integration.disputed'), value: 10 },
    ];

    const syncLog = [
        { state: 'Odisha', files: 1240, pending: 45, lastSync: '10 mins ago', status: 'Active' },
        { state: 'Chhattisgarh', files: 850, pending: 120, lastSync: '25 mins ago', status: 'Active' },
        { state: 'Jharkhand', files: 560, pending: 80, lastSync: '1 hour ago', status: 'Idle' },
        { state: 'Madhya Pradesh', files: 420, pending: 200, lastSync: '2 hours ago', status: 'Active' },
        { state: 'Maharashtra', files: 310, pending: 150, lastSync: '4 hours ago', status: 'Offline' },
    ];

    return (
        <div className="space-y-8">
            {/* Real-time Progress Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: t('dashboard.integration.legacyFilesScanned'), value: digitizationStats.legacyFilesScanned.toLocaleString(), icon: '📄', color: 'blue' },
                    { label: t('dashboard.integration.claimsExtracted'), value: digitizationStats.claimsExtracted.toLocaleString(), icon: '🤖', color: 'purple' },
                    { label: t('dashboard.integration.verifiedPattas'), value: digitizationStats.geotaggedPattas.toLocaleString(), icon: '📍', color: 'green' },
                    { label: t('dashboard.integration.aiAccuracy'), value: digitizationStats.aiAccuracy + '%', icon: '🎯', color: 'orange' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-${stat.color}-50 text-${stat.color}-600`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Digitization Progress Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">{t('dashboard.integration.progressByState')}</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stateProgress} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" unit="%" />
                                <YAxis dataKey="name" type="category" width={80} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="digitized" name={t('dashboard.integration.digitized')} stackId="a" fill={governmentTheme.colors.primary[500]} radius={[0, 0, 0, 0]} />
                                <Bar dataKey="pending" name={t('dashboard.integration.pending')} stackId="a" fill="#e2e8f0" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Verification Status Pie Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">{t('dashboard.integration.verificationStatus')}</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={verificationStatus}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {verificationStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Real-time Sync Log Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">{t('dashboard.integration.syncLog')}</h3>
                    <span className="flex items-center gap-2 text-sm text-green-600">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        {t('dashboard.integration.liveUpdates')}
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium">
                            <tr>
                                <th className="px-6 py-4">{t('dashboard.integration.state')}</th>
                                <th className="px-6 py-4">{t('dashboard.integration.digitizedFiles')}</th>
                                <th className="px-6 py-4">{t('dashboard.integration.pendingVerification')}</th>
                                <th className="px-6 py-4">{t('dashboard.integration.lastSync')}</th>
                                <th className="px-6 py-4">{t('dashboard.integration.status')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {syncLog.map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{row.state}</td>
                                    <td className="px-6 py-4">{row.files.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-orange-600">{row.pending}</td>
                                    <td className="px-6 py-4 text-gray-500">{row.lastSync}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'Active' ? 'bg-green-100 text-green-700' :
                                            row.status === 'Idle' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
