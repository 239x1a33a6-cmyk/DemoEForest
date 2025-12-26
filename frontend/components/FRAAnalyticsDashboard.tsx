"use client";

import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

interface DashboardData {
    national_summary: {
        total_claims: number;
        claims_disposed: number;
        titles_distributed: number;
        pending_claims: number;
        disposal_percentage: number;
        titles_percentage: number;
    };
    states: Array<{
        state: string;
        total_claims: number;
        granted_claims: number;
        pending_claims: number;
        rejected_claims: number;
        percent_disposed: number;
        percent_titles_issued: number;
    }>;
    monthly_trends: Array<{
        month: string;
        approved: number;
        pending: number;
    }>;
    category_split: Array<{
        name: string;
        value: number;
        color: string;
    }>;
    status_split: Array<{
        name: string;
        value: number;
        color: string;
    }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function FRAAnalyticsDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                const response = await fetch(`${apiUrl}/api/dashboard-data`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const jsonData = await response.json();
                setData(jsonData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
                Error loading dashboard: {error}
                <br />
                <span className="text-sm">Make sure the backend server is running on port 5000.</span>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* National Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                    title="Total Claims"
                    value={data.national_summary.total_claims.toLocaleString()}
                    icon="📄"
                    trend="+1.2%"
                />
                <SummaryCard
                    title="Titles Distributed"
                    value={data.national_summary.titles_distributed.toLocaleString()}
                    icon="📜"
                    trend="+0.8%"
                    color="text-emerald-600"
                />
                <SummaryCard
                    title="Pending Claims"
                    value={data.national_summary.pending_claims.toLocaleString()}
                    icon="⏳"
                    trend="-0.5%"
                    color="text-amber-600"
                />
                <SummaryCard
                    title="Disposal Rate"
                    value={`${data.national_summary.disposal_percentage}%`}
                    icon="📊"
                    color="text-blue-600"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Trends */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                    <h3 className="text-lg font-semibold mb-4 text-neutral-800">Monthly Trends</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.monthly_trends}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* State Performance */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                    <h3 className="text-lg font-semibold mb-4 text-neutral-800">Top States by Titles Issued</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data.states.sort((a, b) => b.granted_claims - a.granted_claims).slice(0, 5)}
                                layout="vertical"
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="state" width={100} />
                                <Tooltip
                                    cursor={{ fill: '#f3f4f6' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="granted_claims" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Split */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                    <h3 className="text-lg font-semibold mb-4 text-neutral-800">Claims Status Distribution</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.status_split}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.status_split.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Split */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                    <h3 className="text-lg font-semibold mb-4 text-neutral-800">Claim Category Breakdown</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.category_split}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.category_split.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SummaryCard({ title, value, icon, trend, color = "text-neutral-900" }: { title: string, value: string, icon: string, trend?: string, color?: string }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-neutral-500">{title}</p>
                    <h3 className={`text-2xl font-bold mt-1 ${color}`}>{value}</h3>
                </div>
                <div className="text-2xl bg-neutral-50 p-2 rounded-lg">{icon}</div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    <span className={trend.startsWith('+') ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>
                        {trend}
                    </span>
                    <span className="text-neutral-400 ml-2">from last month</span>
                </div>
            )}
        </div>
    );
}
