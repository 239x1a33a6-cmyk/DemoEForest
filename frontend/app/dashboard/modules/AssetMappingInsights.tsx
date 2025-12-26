// Exact dashboard replication from DashboardModule
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import governmentTheme from '../theme/governmentTheme';
import { fraStateData } from '../fraStateData';

// Define colors for asset types
const ASSET_COLORS = {
    'Agricultural Land': '#84cc16',
    'Water Bodies': '#0ea5e9',
    'Homesteads': '#f97316',
    'Forest Resources': '#166534'
};

export default function AssetMappingInsights() {
    const { t } = useTranslation();
    const [selectedState, setSelectedState] = useState<string>('Madhya Pradesh');
    const [loading, setLoading] = useState(false);
    const [assetData, setAssetData] = useState<any[]>([]);

    const states = Object.keys(fraStateData);

    // Update data when state changes
    useEffect(() => {
        setLoading(true);
        // Simulate network delay for better UX
        const timer = setTimeout(() => {
            const stateData = fraStateData[selectedState]?.assets;
            if (stateData) {
                const formattedData = [
                    { type: t('dashboard.assets.agriculturalLand'), count: stateData.agriculturalLand.count, area: stateData.agriculturalLand.area, confidence: stateData.agriculturalLand.confidence, color: ASSET_COLORS['Agricultural Land'] },
                    { type: t('dashboard.assets.waterBodies'), count: stateData.waterBodies.count, area: stateData.waterBodies.area, confidence: stateData.waterBodies.confidence, color: ASSET_COLORS['Water Bodies'] },
                    { type: t('dashboard.assets.homesteads'), count: stateData.homesteads.count, area: stateData.homesteads.area, confidence: stateData.homesteads.confidence, color: ASSET_COLORS['Homesteads'] },
                    { type: t('dashboard.assets.forestResources'), count: stateData.forestResources.count, area: stateData.forestResources.area, confidence: stateData.forestResources.confidence, color: ASSET_COLORS['Forest Resources'] },
                ];
                setAssetData(formattedData);
            }
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [selectedState, t]);

    return (
        <div className="space-y-6">
            {/* Header & State Selection */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <span>🛰️</span> {t('dashboard.assets.title')}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {t('dashboard.assets.subtitle')}
                    </p>
                </div>
                <select
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-w-[200px]"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                >
                    {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="h-96 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-500 text-sm">{t('dashboard.assets.loading')}</span>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Summary Table (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span>📋</span> {t('dashboard.assets.summary')}
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-600 font-medium">
                                        <tr>
                                            <th className="px-3 py-2 rounded-l-lg">{t('dashboard.assets.assetType')}</th>
                                            <th className="px-3 py-2 text-right">{t('dashboard.assets.count')}</th>
                                            <th className="px-3 py-2 text-right rounded-r-lg">{t('dashboard.assets.area')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {assetData.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-3 py-4 font-medium text-gray-800 flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: row.color }}></div>
                                                    {row.type}
                                                </td>
                                                <td className="px-3 py-4 text-right font-medium">{row.count.toLocaleString()}</td>
                                                <td className="px-3 py-4 text-right text-gray-600">{row.area.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Total Summary */}
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-blue-700 font-medium">{t('dashboard.assets.totalAssets')}</span>
                                    <span className="text-lg font-bold text-blue-900">
                                        {assetData.reduce((acc, curr) => acc + curr.count, 0).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-blue-700 font-medium">{t('dashboard.assets.totalArea')}</span>
                                    <span className="text-lg font-bold text-blue-900">
                                        {assetData.reduce((acc, curr) => acc + curr.area, 0).toLocaleString()} sq.km
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Charts (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Asset Category Distribution (Pie Chart) */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-4">{t('dashboard.assets.distribution')}</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={assetData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="count"
                                            >
                                                {assetData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Asset Area Comparison (Bar Chart) */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-4">{t('dashboard.assets.comparison')}</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={assetData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="type" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={60} />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="area" radius={[4, 4, 0, 0]}>
                                                {assetData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Asset Confidence Score (Full Width) */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4">{t('dashboard.assets.confidence')}</h3>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={assetData} layout="vertical" margin={{ left: 40, right: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                        <XAxis type="number" domain={[0, 100]} unit="%" />
                                        <YAxis dataKey="type" type="category" width={120} style={{ fontSize: '12px', fontWeight: 500 }} />
                                        <Tooltip />
                                        <Bar dataKey="confidence" fill={governmentTheme.colors.primary[500]} radius={[0, 4, 4, 0]} barSize={20} name={t('dashboard.assets.confidenceScore')} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
