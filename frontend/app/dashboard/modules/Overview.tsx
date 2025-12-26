// Exact dashboard replication from DashboardModule
'use client';


import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import governmentTheme from '../theme/governmentTheme';
import { parseCSVData, calculateKPIs, getTopPerformingStates, FRAStateData, DashboardKPIs } from '../utils/dataProcessor';

const COLORS = [
    governmentTheme.colors.primary[500],
    governmentTheme.colors.secondary[500],
    governmentTheme.colors.accent[500],
    '#FF8042'
];

export default function Overview() {
    const { t } = useTranslation();
    const [data, setData] = useState<FRAStateData[]>([]);
    const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/DashboarDataset/fra_state_claims_2024.csv');
                const csvText = await response.text();
                const parsedData = await parseCSVData(csvText);
                setData(parsedData);
                setKpis(calculateKPIs(parsedData));
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading || !kpis) {
        return (
            <div className="animate-pulse space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                    ))}
                </div>
                <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
        );
    }

    const topStates = getTopPerformingStates(data);

    const titleDistribution = [
        { name: t('dashboard.overview.individualTitles'), value: kpis.titles_granted * 0.95 }, // Mock distribution
        { name: t('dashboard.overview.communityTitles'), value: kpis.titles_granted * 0.05 },
    ];

    // Mock trend data for sparklines
    const trendData = [
        { month: 'Jan', value: 4000 },
        { month: 'Feb', value: 3000 },
        { month: 'Mar', value: 2000 },
        { month: 'Apr', value: 2780 },
        { month: 'May', value: 1890 },
        { month: 'Jun', value: 2390 },
    ];

    const kpiCards = [
        {
            label: t('dashboard.overview.totalClaims.label'),
            value: (kpis.total_claims / 1000000).toFixed(2) + 'M',
            subValue: t('dashboard.overview.totalClaims.subValue'),
            color: 'blue',
            trend: '+12%',
        },
        {
            label: t('dashboard.overview.titlesGranted.label'),
            value: (kpis.titles_granted / 1000000).toFixed(2) + 'M',
            subValue: t('dashboard.overview.titlesGranted.subValue'),
            color: 'green',
            trend: '+8%',
        },
        {
            label: t('dashboard.overview.grantRate.label'),
            value: kpis.granted_vs_claimed_percentage.toFixed(1) + '%',
            subValue: t('dashboard.overview.grantRate.subValue'),
            color: 'purple',
            trend: '+5%',
        },
        {
            label: t('dashboard.overview.eligibleArea.label'),
            value: (kpis.eligible_fra_area / 100000).toFixed(1) + 'L Ha',
            subValue: t('dashboard.overview.eligibleArea.subValue'),
            color: 'orange',
            trend: '0%',
        },
    ];

    return (
        <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {kpiCards.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-xs text-gray-500 mt-1">{stat.subValue}</p>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-semibold ${stat.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                {stat.trend}
                            </div>
                        </div>
                        {/* Sparkline */}
                        <div className="h-10 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData}>
                                    <Line type="monotone" dataKey="value" stroke={governmentTheme.colors.primary[400]} strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top 5 States Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">{t('dashboard.overview.topStatesGrantRate')}</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={topStates} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" domain={[0, 100]} unit="%" />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="rate" fill={governmentTheme.colors.primary[500]} radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Title Distribution */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">{t('dashboard.overview.titleDistribution')}</h3>
                    <div className="h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={titleDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {titleDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom 5 Districts Alert (Mock Data) */}
            <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
                    <span>⚠️</span> {t('dashboard.overview.attentionDistricts')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[
                        { district: 'Bastar', state: 'Chhattisgarh', pending: '45,230' },
                        { district: 'Mayurbhanj', state: 'Odisha', pending: '32,100' },
                        { district: 'Adilabad', state: 'Telangana', pending: '28,500' },
                        { district: 'Gadchiroli', state: 'Maharashtra', pending: '25,400' },
                        { district: 'West Singhbhum', state: 'Jharkhand', pending: '22,800' },
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
                            <p className="font-bold text-gray-900">{item.district}</p>
                            <p className="text-xs text-gray-500">{item.state}</p>
                            <p className="text-lg font-bold text-red-600 mt-2">{item.pending}</p>
                            <p className="text-xs text-red-400">{t('dashboard.overview.pendingClaims')}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
