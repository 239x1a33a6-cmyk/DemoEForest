// Exact dashboard replication from DashboardModule
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    RadialBarChart, RadialBar
} from 'recharts';
import governmentTheme from '../theme/governmentTheme';
import { SchemeIcon } from '../components/FRAIcons';

const SCHEMES = [
    { id: 'pmkisan', name: 'PM-KISAN', fullName: 'Pradhan Mantri Kisan Samman Nidhi', color: '#22c55e' },
    { id: 'mgnrega', name: 'MGNREGA', fullName: 'Mahatma Gandhi National Rural Employment Guarantee Act', color: '#eab308' },
    { id: 'jjm', name: 'Jal Jeevan Mission', fullName: 'Har Ghar Jal', color: '#3b82f6' },
    { id: 'dajgua', name: 'DAJGUA', fullName: 'Development Action Plan for Scheduled Tribes', color: '#a855f7' },
];

export default function DSSSchemeLayering() {
    const { t } = useTranslation();
    // Mock DSS Data
    const schemeData = [
        { name: t('dashboard.schemes.pmkisan'), eligible: 1800000, covered: 1450000, gap: 350000, fill: '#22c55e' },
        { name: t('dashboard.schemes.mgnrega'), eligible: 1900000, covered: 1650000, gap: 250000, fill: '#eab308' },
        { name: t('dashboard.schemes.jjm'), eligible: 1950000, covered: 980000, gap: 970000, fill: '#3b82f6' },
        { name: t('dashboard.schemes.dajgua'), eligible: 1200000, covered: 720000, gap: 480000, fill: '#a855f7' },
    ];

    const recommendations = [
        { district: 'Bastar', scheme: 'PM-KISAN', count: 456, message: 'patta holders qualify for irrigation support', priority: 'High' },
        { district: 'Mayurbhanj', scheme: 'Jal Jeevan Mission', count: 1250, message: 'title holders have no drinking water source mapped', priority: 'Critical' },
        { district: 'Adilabad', scheme: 'MGNREGA', count: 890, message: 'eligible for land leveling work', priority: 'Medium' },
    ];

    return (
        <div className="space-y-8">
            {/* Scheme Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Coverage vs Gap Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">{t('dashboard.schemes.coverageVsGap')}</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={schemeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Legend />
                                <Bar dataKey="covered" name={t('dashboard.schemes.covered')} stackId="a" fill={governmentTheme.colors.primary[500]} radius={[0, 0, 4, 4]} />
                                <Bar dataKey="gap" name={t('dashboard.schemes.gap')} stackId="a" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Scheme Eligibility Radial Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">{t('dashboard.schemes.fulfillmentRate')}</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={20} data={schemeData}>
                                <RadialBar
                                    label={{ position: 'insideStart', fill: '#fff' }}
                                    background
                                    dataKey="covered"
                                />
                                <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0 }} />
                                <Tooltip />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Detailed Insights Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <SchemeIcon size={24} color={governmentTheme.colors.primary[600]} />
                        {t('dashboard.schemes.insights')}
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium">
                            <tr>
                                <th className="px-6 py-4">{t('dashboard.schemes.scheme')}</th>
                                <th className="px-6 py-4 text-right">{t('dashboard.schemes.eligible')}</th>
                                <th className="px-6 py-4 text-right">{t('dashboard.schemes.covered')}</th>
                                <th className="px-6 py-4 text-right">{t('dashboard.schemes.gap')}</th>
                                <th className="px-6 py-4">{t('dashboard.schemes.action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {schemeData.map((row, idx) => {
                                const gapPercent = (row.gap / row.eligible) * 100;
                                return (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{row.name}</td>
                                        <td className="px-6 py-4 text-right">{row.eligible.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right text-green-600">{row.covered.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-red-600 font-medium">{gapPercent.toFixed(1)}%</span>
                                            <span className="text-gray-400 text-xs block">({row.gap.toLocaleString()})</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 px-3 py-1 rounded-full hover:bg-blue-50 transition-colors">
                                                {t('dashboard.schemes.initiateDrive')}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* AI Recommendation Panel */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                    <span>✨</span> {t('dashboard.schemes.recommendations')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recommendations.map((rec, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100 relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-1 h-full ${rec.priority === 'Critical' ? 'bg-red-500' :
                                rec.priority === 'High' ? 'bg-orange-500' : 'bg-blue-500'
                                }`}></div>
                            <div className="pl-3">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{rec.district}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rec.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                                        rec.priority === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {rec.priority} {t('dashboard.schemes.priority')}
                                    </span>
                                </div>
                                <p className="text-gray-800 font-medium text-sm mb-1">
                                    <span className="font-bold text-indigo-600">{rec.count}</span> {rec.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">{t('dashboard.schemes.scheme')}: {rec.scheme}</p>
                                <button className="mt-3 w-full py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded hover:bg-indigo-100 transition-colors">
                                    {t('dashboard.schemes.viewBeneficiaries')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
