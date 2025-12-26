'use client';

import { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, Sector
} from 'recharts';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { autoTranslateSync } from '@/utils/translationFallback';

import fraData from '../../data/fra_dashboard_data.json';

// Custom Active Shape for Donut Chart
const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-lg font-bold">
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`Value: ${value.toLocaleString('en-IN')}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`(Rate ${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};

export default function FRAAnalyticsDashboard() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const [data, setData] = useState(fraData);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    // useEffect removed as we import data directly

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    const handleStateClick = (stateName) => {
        router.push(`/atlas?state=${encodeURIComponent(stateName)}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                <p className="mt-4 text-gray-600">{t('loading') || autoTranslateSync('Loading...', i18n.language)}</p>
            </div>
        );
    }

    if (!data) return <div className="text-center p-10 text-red-500">{t('failedToLoadDashboard') || autoTranslateSync('Failed to load dashboard data.', i18n.language)}</div>;

    const { national_summary, states, monthly_trends, category_split, status_split, recent_activity } = data;

    // Sort states by titles percentage
    const sortedStates = [...states].sort((a, b) => b.percent_titles_issued - a.percent_titles_issued);

    const kpiCards = [
        { title: t('totalClaimsReceived') || autoTranslateSync('Total Claims Received', i18n.language), value: national_summary.total_claims, icon: '📋', color: 'blue', delta: '+12%' },
        { title: t('claimsDisposed') || autoTranslateSync('Claims Disposed', i18n.language), value: national_summary.claims_disposed, icon: '✅', color: 'green', delta: '+8%' },
        { title: t('titlesDistributed') || autoTranslateSync('Titles Distributed', i18n.language), value: national_summary.titles_distributed, icon: '📜', color: 'indigo', delta: '+15%' },
        { title: t('pendingClaims') || autoTranslateSync('Pending Claims', i18n.language), value: national_summary.pending_claims, icon: '⏳', color: 'orange', delta: '-5%' },
        { title: t('disposalPercentage') || autoTranslateSync('Disposal %', i18n.language), value: `${national_summary.disposal_percentage}%`, icon: '📊', color: 'purple', delta: '+2.5%' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t('fraAnalyticsDashboard') || autoTranslateSync('FRA Analytics Dashboard', i18n.language)}</h1>
                <p className="text-gray-500 mt-1">{t('realTimeInsights') || autoTranslateSync('Real-time insights into Forest Rights Act implementation across India', i18n.language)}</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {kpiCards.map((kpi, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg bg-${kpi.color}-50 text-${kpi.color}-600 text-2xl`}>
                                {kpi.icon}
                            </div>
                            <span className={`text-sm font-medium px-2 py-1 rounded-full ${kpi.delta.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                }`}>
                                {kpi.delta}
                            </span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">{kpi.title}</h3>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{typeof kpi.value === 'number' ? kpi.value.toLocaleString('en-IN') : kpi.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Charts */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Top Row Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* ZONE 1: Claims Category Analysis */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">{t('claimsCategoryAnalysis') || autoTranslateSync('Claims Category Analysis', i18n.language)}</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            activeIndex={activeIndex}
                                            activeShape={renderActiveShape}
                                            data={category_split}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            onMouseEnter={onPieEnter}
                                        >
                                            {category_split.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* ZONE 2: Claim Status Split */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">{t('claimStatusSplit') || autoTranslateSync('Claim Status Split', i18n.language)}</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={status_split}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {status_split.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* ZONE 3: Time Trend Analytics */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">{t('monthlyProcessingTrends') || autoTranslateSync('Monthly Processing Trends', i18n.language)}</h3>
                        <div className="h-72 w-full">
                            {monthly_trends && monthly_trends.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthly_trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        />
                                        <Legend />
                                        <Area
                                            type="monotone"
                                            dataKey="approved"
                                            stroke="#10b981"
                                            fillOpacity={1}
                                            fill="url(#colorApproved)"
                                            name={t('approved') || "Approved"}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="pending"
                                            stroke="#f59e0b"
                                            fillOpacity={1}
                                            fill="url(#colorPending)"
                                            name={t('pending') || "Pending"}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    {t('noDataAvailable') || "No trend data available"}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ZONE 4: State Performance Ranking */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">{t('statePerformanceRanking') || autoTranslateSync('State Performance Ranking (Titles Issued %)', i18n.language)}</h3>
                        <div className="h-96 overflow-y-auto pr-2">
                            <ResponsiveContainer width="100%" height={sortedStates.length * 60}>
                                <BarChart
                                    layout="vertical"
                                    data={sortedStates}
                                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" domain={[0, 100]} />
                                    <YAxis type="category" dataKey="state" width={100} tick={{ fontSize: 12, fontWeight: 600 }} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
                                                        <p className="font-bold text-gray-900">{data.state}</p>
                                                        <p className="text-sm text-green-600">Titles: {data.granted_claims.toLocaleString('en-IN')}</p>
                                                        <p className="text-sm text-gray-600">Total: {data.total_claims.toLocaleString('en-IN')}</p>
                                                        <p className="text-sm font-bold mt-1">Rate: {data.percent_titles_issued}%</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar
                                        dataKey="percent_titles_issued"
                                        fill="#3b82f6"
                                        radius={[0, 4, 4, 0]}
                                        barSize={20}
                                        onClick={(data) => handleStateClick(data.state)}
                                        className="cursor-pointer hover:opacity-80 transition-opacity"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                {/* Right Column - Activity Feed */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                            {t('liveActivityFeed') || autoTranslateSync('Live Activity Feed', i18n.language)}
                        </h3>
                        <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                            {recent_activity.map((activity) => (
                                <div key={activity.id} className="relative pl-10">
                                    <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${activity.type === 'grant' ? 'bg-green-100 text-green-600' :
                                        activity.type === 'reject' ? 'bg-red-100 text-red-600' :
                                            activity.type === 'review' ? 'bg-blue-100 text-blue-600' :
                                                'bg-gray-100 text-gray-600'
                                        }`}>
                                        <i className={`ri-${activity.type === 'grant' ? 'check-line' :
                                            activity.type === 'reject' ? 'close-line' :
                                                activity.type === 'review' ? 'file-search-line' :
                                                    'notification-line'
                                            }`}></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
                            {t('viewAllActivity') || autoTranslateSync('View All Activity', i18n.language)}
                        </button>
                    </div>

                    {/* District Insights Placeholder */}
                    <div className="mt-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
                        <h3 className="text-lg font-bold mb-2">{t('districtInsights') || autoTranslateSync('District Insights', i18n.language)}</h3>
                        <p className="text-indigo-100 text-sm mb-4">
                            {t('selectStateFromRanking') || autoTranslateSync('Select a state from the ranking chart to view detailed district-level performance metrics.', i18n.language)}
                        </p>
                        <div className="flex items-center text-sm font-medium bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                            <i className="ri-information-line mr-2"></i>
                            {t('clickAnyBarToExplore') || autoTranslateSync('Click any bar in the chart to explore', i18n.language)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
