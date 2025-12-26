'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useRouter } from 'next/navigation';

export default function FRAInsightsDashboard() {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load FRA data
        fetch('/data/fra_national_stats.json')
            .then(res => res.json())
            .then(fraData => {
                setData(fraData);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading FRA data:', err);
                setLoading(false);
            });
    }, []);

    const handleStateClick = (stateName) => {
        // Navigate to district analytics view
        router.push(`/atlas?state=${encodeURIComponent(stateName)}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-600">Error loading dashboard data</div>
            </div>
        );
    }

    const { national_summary, states, rights_categories, monthly_trend, recent_events } = data;

    // Sort states by percent_completed (high to low)
    const sortedStates = [...states].sort((a, b) => b.percent_completed - a.percent_completed);

    // Prepare rights category data for chart
    const categoryData = [
        { category: 'IFR', granted: rights_categories.IFR.granted, pending: rights_categories.IFR.pending },
        { category: 'CFR', granted: rights_categories.CFR.granted, pending: rights_categories.CFR.pending },
        { category: 'CR', granted: rights_categories.CR.granted, pending: rights_categories.CR.pending },
    ];

    // KPI Cards Data
    const kpiCards = [
        {
            title: 'Total Claims Received',
            value: national_summary.total_claims_received.toLocaleString(),
            icon: '📋',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            borderColor: 'border-blue-200'
        },
        {
            title: 'Total Titles Granted',
            value: national_summary.total_titles_granted.toLocaleString(),
            icon: '✅',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            borderColor: 'border-green-200'
        },
        {
            title: 'Claims Under Processing',
            value: national_summary.claims_under_processing.toLocaleString(),
            icon: '⏳',
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600',
            borderColor: 'border-orange-200'
        },
        {
            title: 'Disposal Rate Overall',
            value: `${national_summary.disposal_rate}%`,
            icon: '📊',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            borderColor: 'border-purple-200'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        FRA Insights Dashboard
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Forest Rights Act Progress - Ministry of Tribal Affairs (MoTA)
                    </p>
                </div>

                {/* 1️⃣ Header KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {kpiCards.map((card, index) => (
                        <div
                            key={index}
                            className={`${card.bgColor} ${card.borderColor} border-2 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                                        {card.title}
                                    </p>
                                    <p className={`text-3xl font-bold ${card.iconColor}`}>
                                        {card.value}
                                    </p>
                                </div>
                                <div className={`text-4xl ${card.iconColor}`}>
                                    {card.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 2️⃣ National Progress Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Monthly Trend */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="mr-2">📈</span>
                            Monthly Progress Trend
                        </h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthly_trend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="month" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="claims"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        dot={{ fill: '#3b82f6', r: 5 }}
                                        activeDot={{ r: 7 }}
                                        name="Claims Received"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="grants"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={{ fill: '#10b981', r: 5 }}
                                        activeDot={{ r: 7 }}
                                        name="Titles Granted"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Rights Category Distribution */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="mr-2">📊</span>
                            Rights Category Distribution
                        </h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="category" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="granted" fill="#10b981" name="Granted" radius={[8, 8, 0, 0]} />
                                    <Bar dataKey="pending" fill="#f59e0b" name="Pending" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* 3️⃣ State-wise Completion Graph */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-8 hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="mr-2">🗺️</span>
                        State-wise Completion Progress
                    </h3>
                    <div className="space-y-4">
                        {sortedStates.map((state, index) => (
                            <div
                                key={index}
                                onClick={() => handleStateClick(state.state)}
                                className="group cursor-pointer bg-gradient-to-r from-gray-50 to-white hover:from-green-50 hover:to-green-100 rounded-lg p-5 border-2 border-gray-200 hover:border-green-400 transition-all duration-300 hover:shadow-md"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg text-gray-900 group-hover:text-green-700 transition-colors">
                                            {state.state}
                                        </h4>
                                        <div className="flex items-center space-x-6 text-sm text-gray-600 mt-1">
                                            <span className="flex items-center">
                                                <span className="font-semibold mr-1">Total Claims:</span>
                                                {state.total_claims_received.toLocaleString()}
                                            </span>
                                            <span className="flex items-center">
                                                <span className="font-semibold mr-1 text-green-600">Granted:</span>
                                                <span className="text-green-700 font-bold">{state.titles_granted.toLocaleString()}</span>
                                            </span>
                                            <span className="flex items-center">
                                                <span className="font-semibold mr-1 text-orange-600">Pending:</span>
                                                <span className="text-orange-700 font-bold">{state.pending_claims.toLocaleString()}</span>
                                            </span>
                                            <span className="flex items-center">
                                                <span className="font-semibold mr-1 text-red-600">Rejected:</span>
                                                <span className="text-red-700 font-bold">{state.rejected_claims.toLocaleString()}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-48 bg-gray-200 rounded-full h-4 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500 shadow-sm"
                                                style={{ width: `${state.percent_completed}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xl font-bold text-green-600 w-16 text-right">
                                            {state.percent_completed}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4️⃣ Recent Events Panel */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="mr-2">🔔</span>
                        Recent Events & Updates
                    </h3>
                    <div className="space-y-3">
                        {recent_events.map((event) => (
                            <div
                                key={event.id}
                                className={`flex items-start p-4 rounded-lg border-l-4 transition-all duration-300 hover:shadow-md ${event.type === 'grant'
                                        ? 'bg-green-50 border-green-500 hover:bg-green-100'
                                        : 'bg-red-50 border-red-500 hover:bg-red-100'
                                    }`}
                            >
                                <div className={`text-3xl mr-4 ${event.type === 'grant' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {event.type === 'grant' ? '✅' : '❌'}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`font-bold text-lg ${event.type === 'grant' ? 'text-green-900' : 'text-red-900'
                                        }`}>
                                        {event.title}
                                    </h4>
                                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                        <span className="flex items-center">
                                            <span className="mr-1">📍</span>
                                            {event.state}
                                        </span>
                                        <span className="flex items-center">
                                            <span className="mr-1">📅</span>
                                            {new Date(event.date).toLocaleDateString('en-IN', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>
                                        <span className={`font-semibold ${event.type === 'grant' ? 'text-green-700' : 'text-red-700'
                                            }`}>
                                            {event.count.toLocaleString()} claims
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
