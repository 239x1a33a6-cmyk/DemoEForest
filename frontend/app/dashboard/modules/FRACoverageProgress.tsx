// Exact dashboard replication from DashboardModule
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import governmentTheme from '../theme/governmentTheme';
import { parseCSVData, FRAStateData } from '../utils/dataProcessor';
import { useClaimsData } from '../hooks/useGeoData';
import { fraStateData } from '../fraStateData';

// Dynamically import map to avoid SSR issues
const FRACoverageMap = dynamic(() => import('../components/FRACoverageMap'), {
    ssr: false,
    loading: () => <div className="h-[500px] bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">
        <span className="text-gray-500">Loading map...</span>
    </div>
});

// Mock GeoJSON-like data for visualization purposes
const MAP_LAYERS = {
    IFR: { color: '#22c55e', label: 'IFR Boundaries' },
    CR: { color: '#3b82f6', label: 'CR Boundaries' },
    CFR: { color: '#a855f7', label: 'CFR Boundaries' }
};

export default function FRACoverageProgress() {
    const { t } = useTranslation();
    const [data, setData] = useState<FRAStateData[]>([]);
    const [selectedState, setSelectedState] = useState<string>('All States');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('All Districts');
    const [selectedTribe, setSelectedTribe] = useState<string>('All Tribal Groups');
    const [selectedLayer, setSelectedLayer] = useState<string>('IFR');
    const [loading, setLoading] = useState(true);
    const [regionStats, setRegionStats] = useState<any>({
        totalArea: '0',
        villages: 0,
        pattaHolders: 0,
        approved: 0,
        pending: 0,
        rejected: 0
    });

    // Load claims data
    const { claims, loading: claimsLoading } = useClaimsData();

    // Load state data for dropdowns
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/DashboarDataset/fra_state_claims_2024.csv');
                const csvText = await response.text();
                const parsedData = await parseCSVData(csvText);
                setData(parsedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Define allowed states (only these 4)
    const allowedStates = ['Madhya Pradesh', 'Odisha', 'Telangana', 'Tripura'];
    const states = allowedStates;

    // Get districts for selected state
    const districts = selectedState && selectedState !== 'All States'
        ? Array.from(new Set(claims.filter(c => c.state === selectedState).map(c => c.district))).sort()
        : [];

    // Get tribal groups
    const tribalGroups = Array.from(new Set(claims.map(c => c.tribal_group))).sort();

    // Prepare chart data by state - use real FRA statistics
    const chartData = selectedState && selectedState !== 'All States'
        ? [{
            name: selectedState,
            Received: fraStateData[selectedState]?.ifr.claims || 0,
            Distributed: fraStateData[selectedState]?.ifr.titles || 0
        }]
        : states.map(state => ({
            name: state,
            Received: fraStateData[state]?.ifr.claims || 0,
            Distributed: fraStateData[state]?.ifr.titles || 0
        }));

    // Generate state-specific coverage trend data from fraStateData
    const getCoverageTrendData = () => {
        if (selectedState && selectedState !== 'All States' && fraStateData[selectedState]) {
            // Use real state-specific trend data
            return fraStateData[selectedState].coverageTrend;
        } else {
            // All states - aggregate trend (average of all states)
            return [
                { month: 'Jan', value: 35 },
                { month: 'Feb', value: 41 },
                { month: 'Mar', value: 46 },
                { month: 'Apr', value: 56 },
                { month: 'May', value: 61 }
            ];
        }
    };

    const coverageTrendData = getCoverageTrendData();

    if (loading || claimsLoading) {
        return <div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>;
    }

    return (
        <div className="space-y-6">
            {/* Filters Header */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4">
                    <select
                        className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={selectedState}
                        onChange={(e) => {
                            setSelectedState(e.target.value);
                            setSelectedDistrict('All Districts');
                        }}
                    >
                        <option value="All States">{t('dashboard.coverage.allStates')}</option>
                        {states.map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map Visualization */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
                    <FRACoverageMap
                        selectedState={selectedState}
                        selectedDistrict={selectedDistrict}
                        selectedTribe={selectedTribe}
                        claims={claims}
                        onStatsUpdate={setRegionStats}
                        onStateSelect={(stateName) => {
                            setSelectedState(stateName);
                            setSelectedDistrict('All Districts');
                        }}
                        onDistrictSelect={(districtName) => {
                            setSelectedDistrict(districtName);
                        }}
                    />

                    {/* Map Overlay Stats */}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs z-[1000]">
                        <h4 className="font-bold text-gray-900 mb-2">{t('dashboard.coverage.selectedRegionStats')}</h4>
                        <div className="space-y-2 text-sm">
                            {selectedState && selectedState !== 'All States' && fraStateData[selectedState] ? (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{t('dashboard.coverage.ifrClaims')}:</span>
                                        <span className="font-medium">{fraStateData[selectedState].ifr.claims.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{t('dashboard.coverage.ifrTitles')}:</span>
                                        <span className="font-medium">{fraStateData[selectedState].ifr.titles.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{t('dashboard.coverage.cfrClaims')}:</span>
                                        <span className="font-medium">{fraStateData[selectedState].cfr.claims.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{t('dashboard.coverage.cfrTitles')}:</span>
                                        <span className="font-medium">{fraStateData[selectedState].cfr.titles.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center gap-2 pt-2 border-t">
                                        <span className="text-green-600 text-xs">✓ {t('dashboard.coverage.approved')}: {fraStateData[selectedState].claimsStatus.approved.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center gap-2">
                                        <span className="text-yellow-600 text-xs">⏳ {t('dashboard.coverage.pending')}: {fraStateData[selectedState].claimsStatus.pending.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center gap-2">
                                        <span className="text-red-600 text-xs">✗ {t('dashboard.coverage.rejected')}: {fraStateData[selectedState].claimsStatus.rejected.toLocaleString()}</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{t('dashboard.coverage.totalArea')}:</span>
                                        <span className="font-medium">{regionStats.totalArea} sq.km</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{t('dashboard.coverage.villages')}:</span>
                                        <span className="font-medium">{regionStats.villages}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{t('dashboard.coverage.pattaHolders')}:</span>
                                        <span className="font-medium">{regionStats.pattaHolders}</span>
                                    </div>
                                    <div className="flex justify-between items-center gap-2 pt-2 border-t">
                                        <span className="text-green-600 text-xs">✓ {t('dashboard.coverage.approved')}: {regionStats.approved}</span>
                                        <span className="text-yellow-600 text-xs">⏳ {t('dashboard.coverage.pending')}: {regionStats.pending}</span>
                                        <span className="text-red-600 text-xs">✗ {t('dashboard.coverage.rejected')}: {regionStats.rejected}</span>
                                    </div>
                                </>
                            )}
                            <div className="text-xs text-gray-400 mt-2 pt-2 border-t">
                                {t('dashboard.coverage.source')} {new Date().toLocaleDateString('en-GB')}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Side Panel Stats */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4">
                            {t('dashboard.coverage.claimsVsTitles')} {selectedState && selectedState !== 'All States' && `- ${selectedState}`}
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} layout="vertical" margin={{ left: 40 }} key={selectedState}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={80} style={{ fontSize: '10px' }} />
                                    <Tooltip />
                                    <Bar dataKey="Received" fill="#94a3b8" radius={[0, 4, 4, 0]} barSize={10} />
                                    <Bar dataKey="Distributed" fill="#22c55e" radius={[0, 4, 4, 0]} barSize={10} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4">
                            {t('dashboard.coverage.coverageTrend')} {selectedState && selectedState !== 'All States' && `- ${selectedState}`}
                        </h3>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={coverageTrendData} key={selectedState}>
                                    <defs>
                                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
