'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { VillageData, MapFilters } from '@/types/dss';
import { getStates, getDistricts, getBlocks, getVillageNames } from '@/lib/mockData';

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/dss/SpatialMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
                <i className="ri-loader-4-line text-4xl text-blue-600 animate-spin"></i>
                <p className="mt-2 text-gray-600">Loading map...</p>
            </div>
        </div>
    )
});

export default function SpatialDecisionEngine() {
    const [villages, setVillages] = useState<VillageData[]>([]);
    const [selectedVillage, setSelectedVillage] = useState<VillageData | null>(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<MapFilters>({
        state: 'All',
        district: 'All',
        block: 'All',
        village: 'All',
        visibleLayers: ['village-boundary', 'heatmap'],
        heatmapMetric: 'overall'
    });

    const [availableStates] = useState<string[]>(['All', ...getStates()]);
    const [availableDistricts, setAvailableDistricts] = useState<string[]>(['All']);
    const [availableBlocks, setAvailableBlocks] = useState<string[]>(['All']);
    const [availableVillages, setAvailableVillages] = useState<string[]>(['All']);

    // Update cascading filters
    // Update cascading filters
    useEffect(() => {
        const fetchDistricts = async () => {
            if (filters.state !== 'All') {
                try {
                    // Fetch the GeoJSON for the selected state
                    const response = await fetch(`/data/new_districts/${filters.state}.json`);
                    if (!response.ok) {
                        console.error(`Failed to fetch districts for ${filters.state}`);
                        setAvailableDistricts(['All']);
                        return;
                    }

                    const data = await response.json();

                    // Extract unique district names from the GeoJSON features
                    // Using 'dtname' as verified in the dataset
                    const districtNames = [...new Set(
                        data.features
                            .map((ft: any) => ft.properties.dtname)
                            .filter((name: string) => name) // Filter out null/undefined
                            .sort()
                    )] as string[];

                    console.log("Districts found for", filters.state, districtNames);

                    setAvailableDistricts(['All', ...districtNames]);
                } catch (error) {
                    console.error("Error fetching districts:", error);
                    setAvailableDistricts(['All']);
                }
            } else {
                setAvailableDistricts(['All']);
            }
            // Reset dependent filters
            setFilters(prev => ({ ...prev, district: 'All', block: 'All', village: 'All' }));
        };

        fetchDistricts();
    }, [filters.state]);

    useEffect(() => {
        if (filters.district !== 'All') {
            setAvailableBlocks(['All', ...getBlocks(filters.district)]);
        } else {
            setAvailableBlocks(['All']);
        }
        setFilters(prev => ({ ...prev, block: 'All', village: 'All' }));
    }, [filters.district]);

    useEffect(() => {
        if (filters.block !== 'All') {
            setAvailableVillages(['All', ...getVillageNames(filters.block)]);
        } else {
            setAvailableVillages(['All']);
        }
        setFilters(prev => ({ ...prev, village: 'All' }));
    }, [filters.block]);

    // Fetch villages based on filters
    useEffect(() => {
        fetchVillages();
    }, [filters.state, filters.district, filters.block, filters.village]);

    const fetchVillages = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.state !== 'All') params.append('state', filters.state);
            if (filters.district !== 'All') params.append('district', filters.district);
            if (filters.block !== 'All') params.append('block', filters.block);
            if (filters.village !== 'All') params.append('village', filters.village);

            const response = await fetch(`/api/dss/spatial/villages?${params.toString()}`);
            const result = await response.json();

            if (result.success) {
                setVillages(result.data);
            }
        } catch (error) {
            console.error('Error fetching villages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key: keyof MapFilters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const toggleLayer = (layerId: string) => {
        setFilters(prev => ({
            ...prev,
            visibleLayers: prev.visibleLayers.includes(layerId)
                ? prev.visibleLayers.filter(id => id !== layerId)
                : [...prev.visibleLayers, layerId]
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <i className="ri-map-2-line text-3xl"></i>
                    <h2 className="text-2xl font-bold">Spatial Decision Engine</h2>
                </div>
                <p className="text-green-100">
                    Interactive WebGIS platform for FRA claim analysis and vulnerability assessment
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <i className="ri-filter-3-line text-blue-600"></i>
                    Location Filters
                </h3>
                {/* from here */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <select
                            value={filters.state}
                            onChange={(e) => handleFilterChange('state', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {availableStates.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                        <select
                            value={filters.district}
                            onChange={(e) => handleFilterChange('district', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={filters.state === 'All'}
                        >
                            {availableDistricts.map(district => (
                                <option key={district} value={district}>{district}</option>
                            ))}
                        </select>
                    </div>

                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Block</label>
                        <select
                            value={filters.block}
                            onChange={(e) => handleFilterChange('block', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={filters.district === 'All'}
                        >
                            {availableBlocks.map(block => (
                                <option key={block} value={block}>{block}</option>
                            ))}
                        </select>
                    </div> */}

                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
                        <select
                            value={filters.village}
                            onChange={(e) => handleFilterChange('village', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={filters.block === 'All'}
                        >
                            {availableVillages.map(village => (
                                <option key={village} value={village}>{village}</option>
                            ))}
                        </select>
                    </div> */}
                </div>

                {/* Layer Controls */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Map Layers</h4>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { id: 'village-boundary', label: 'Village Boundaries', icon: 'ri-shape-line' },
                            { id: 'heatmap', label: 'Vulnerability Heatmap', icon: 'ri-fire-line' },
                            { id: 'water-bodies', label: 'Water Bodies', icon: 'ri-water-flash-line' },
                            { id: 'forest-area', label: 'Forest Areas', icon: 'ri-plant-line' }
                        ].map(layer => (
                            <button
                                key={layer.id}
                                onClick={() => toggleLayer(layer.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filters.visibleLayers.includes(layer.id)
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <i className={`${layer.icon} mr-2`}></i>
                                {layer.label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Heatmap Metric</label>
                        <select
                            value={filters.heatmapMetric}
                            onChange={(e) => handleFilterChange('heatmapMetric', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="overall">Overall Vulnerability</option>
                            <option value="water">Water Vulnerability</option>
                            <option value="livelihood">Livelihood Vulnerability</option>
                            <option value="ecological">Ecological Sensitivity</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Interactive Map</h3>
                    <div className="text-sm text-gray-600">
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <i className="ri-loader-4-line animate-spin"></i>
                                Loading...
                            </span>
                        ) : (
                            <span>{villages.length} villages displayed</span>
                        )}
                    </div>
                </div>

                <MapComponent
                    villages={villages}
                    filters={filters}
                    onVillageSelect={setSelectedVillage}
                />
            </div>

            {/* Selected Village Details */}
            {selectedVillage && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Village Details: {selectedVillage.name}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* FRA Patta Statistics */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">FRA Patta Statistics</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">IFR Issued:</span>
                                    <span className="font-medium">{selectedVillage.pattaStats.ifrIssued}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">IFR Pending:</span>
                                    <span className="font-medium text-orange-600">{selectedVillage.pattaStats.ifrPending}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">CR Issued:</span>
                                    <span className="font-medium">{selectedVillage.pattaStats.crIssued}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">CFR Issued:</span>
                                    <span className="font-medium">{selectedVillage.pattaStats.cfrIssued}</span>
                                </div>
                                <div className="pt-2 border-t border-gray-200">
                                    <div className="flex justify-between text-sm font-semibold">
                                        <span className="text-gray-900">Total Issued:</span>
                                        <span className="text-green-600">{selectedVillage.pattaStats.totalIssued}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Land Use */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Land Use (hectares)</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Cultivable:</span>
                                    <span className="font-medium">{selectedVillage.landUse.cultivable}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Forest:</span>
                                    <span className="font-medium">{selectedVillage.landUse.forest}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Water:</span>
                                    <span className="font-medium">{selectedVillage.landUse.water}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Wasteland:</span>
                                    <span className="font-medium">{selectedVillage.landUse.wasteland}</span>
                                </div>
                            </div>
                        </div>

                        {/* Vulnerability Scores */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Vulnerability Scores</h4>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Water:</span>
                                        <span className="font-medium">{selectedVillage.vulnerabilityScores.water}/100</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${selectedVillage.vulnerabilityScores.water}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Livelihood:</span>
                                        <span className="font-medium">{selectedVillage.vulnerabilityScores.livelihood}/100</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-600 h-2 rounded-full"
                                            style={{ width: `${selectedVillage.vulnerabilityScores.livelihood}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Ecological:</span>
                                        <span className="font-medium">{selectedVillage.vulnerabilityScores.ecological}/100</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-emerald-600 h-2 rounded-full"
                                            style={{ width: `${selectedVillage.vulnerabilityScores.ecological}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scheme Coverage */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Scheme Coverage</h4>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{selectedVillage.schemeCoverage.pmKisan}</div>
                                <div className="text-xs text-gray-600">PM-KISAN</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{selectedVillage.schemeCoverage.mgnrega}</div>
                                <div className="text-xs text-gray-600">MGNREGA</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-cyan-600">{selectedVillage.schemeCoverage.jjm}</div>
                                <div className="text-xs text-gray-600">JJM</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{selectedVillage.schemeCoverage.dajgua}</div>
                                <div className="text-xs text-gray-600">DAJGUA</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">{selectedVillage.schemeCoverage.coveragePercentage.toFixed(1)}%</div>
                                <div className="text-xs text-gray-600">Total Coverage</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
