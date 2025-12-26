'use client';

import { useState, useEffect } from 'react';
import { ClusterResult } from '@/types/dss';
import { getStates, getDistricts } from '@/lib/mockData';

export default function AIRecommendationEngine() {
    const [clusters, setClusters] = useState<ClusterResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCluster, setSelectedCluster] = useState<ClusterResult | null>(null);
    const [state, setState] = useState<string>('All');
    const [district, setDistrict] = useState<string>('All');

    const [availableStates] = useState<string[]>(['All', ...getStates()]);
    const [availableDistricts, setAvailableDistricts] = useState<string[]>(['All']);

    useEffect(() => {
        if (state !== 'All') {
            setAvailableDistricts(['All', ...getDistricts(state)]);
        } else {
            setAvailableDistricts(['All', ...getDistricts()]);
        }
        setDistrict('All');
    }, [state]);

    useEffect(() => {
        fetchClusters();
    }, [state, district]);

    const fetchClusters = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (state !== 'All') params.append('state', state);
            if (district !== 'All') params.append('district', district);

            const response = await fetch(`/api/dss/recommendations/cluster?${params.toString()}`);
            const result = await response.json();

            if (result.success) {
                setClusters(result.data);
                if (result.data.length > 0) {
                    setSelectedCluster(result.data[0]);
                }
            }
        } catch (error) {
            console.error('Error fetching clusters:', error);
        } finally {
            setLoading(false);
        }
    };

    const getClusterIcon = (type: string) => {
        const icons: Record<string, string> = {
            'water-stressed': 'ri-water-flash-line',
            'forest-livelihood': 'ri-plant-line',
            'agro-potential': 'ri-seedling-line',
            'highly-vulnerable': 'ri-alert-line'
        };
        return icons[type] || 'ri-map-pin-line';
    };

    const getClusterColor = (type: string) => {
        const colors: Record<string, { bg: string; text: string; border: string }> = {
            'water-stressed': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
            'forest-livelihood': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
            'agro-potential': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
            'highly-vulnerable': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
        };
        return colors[type] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <i className="ri-brain-line text-3xl"></i>
                    <h2 className="text-2xl font-bold">AI Recommendation Engine</h2>
                </div>
                <p className="text-emerald-100">
                    ML-powered village clustering and targeted scheme recommendations
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <i className="ri-filter-3-line text-purple-600"></i>
                    Analysis Scope
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <select
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            {availableStates.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                        <select
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            disabled={state === 'All'}
                        >
                            {availableDistricts.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Clusters Overview */}
            {loading ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <i className="ri-loader-4-line text-4xl text-purple-600 animate-spin"></i>
                    <p className="mt-4 text-gray-600">Analyzing villages and generating clusters...</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {clusters.map((cluster) => {
                            const colors = getClusterColor(cluster.clusterType);
                            const isSelected = selectedCluster?.clusterId === cluster.clusterId;

                            return (
                                <button
                                    key={cluster.clusterId}
                                    onClick={() => setSelectedCluster(cluster)}
                                    className={`text-left p-5 rounded-xl border-2 transition-all ${isSelected
                                        ? `${colors.bg} ${colors.border} shadow-lg scale-105`
                                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                                        }`}
                                >
                                    <div className={`${colors.bg} ${colors.text} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
                                        <i className={`${getClusterIcon(cluster.clusterType)} text-2xl`}></i>
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-1">{cluster.clusterName}</h3>
                                    <div className="text-sm text-gray-600 mb-2">{cluster.villages.length} villages</div>
                                    <div className="flex items-center gap-1 text-xs">
                                        <span className="text-gray-500">Priority:</span>
                                        <span className={`font-semibold ${colors.text}`}>{cluster.priorityScore.toFixed(1)}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Selected Cluster Details */}
                    {selectedCluster && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedCluster.clusterName}</h3>
                                    <p className="text-gray-600">{selectedCluster.villages.length} villages • Priority Score: {selectedCluster.priorityScore.toFixed(1)}</p>
                                </div>
                                <div className={`${getClusterColor(selectedCluster.clusterType).bg} ${getClusterColor(selectedCluster.clusterType).text} px-4 py-2 rounded-lg font-medium text-sm`}>
                                    {selectedCluster.clusterType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </div>
                            </div>

                            {/* Characteristics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Vulnerability Profile</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600">Water:</span>
                                                <span className="font-medium">{selectedCluster.characteristics.avgWaterVulnerability.toFixed(1)}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${selectedCluster.characteristics.avgWaterVulnerability}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600">Livelihood:</span>
                                                <span className="font-medium">{selectedCluster.characteristics.avgLivelihoodVulnerability.toFixed(1)}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full"
                                                    style={{ width: `${selectedCluster.characteristics.avgLivelihoodVulnerability}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600">Ecological:</span>
                                                <span className="font-medium">{selectedCluster.characteristics.avgEcologicalSensitivity.toFixed(1)}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-emerald-600 h-2 rounded-full"
                                                    style={{ width: `${selectedCluster.characteristics.avgEcologicalSensitivity}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Demographics</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Population:</span>
                                            <span className="font-medium">{selectedCluster.characteristics.totalPopulation.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Households:</span>
                                            <span className="font-medium">{selectedCluster.characteristics.totalHouseholds.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Dominant Livelihood:</span>
                                            <span className="font-medium">{selectedCluster.characteristics.dominantLivelihood}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Issues</h4>
                                    <ul className="space-y-1">
                                        {selectedCluster.characteristics.keyIssues.map((issue, idx) => (
                                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                                <i className="ri-error-warning-line text-orange-500 mt-0.5"></i>
                                                <span>{issue}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Recommended Schemes */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Recommended Schemes</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedCluster.recommendedSchemes.map((scheme) => (
                                        <div key={scheme.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all">
                                            <div className="flex items-start justify-between mb-2">
                                                <h5 className="font-semibold text-gray-900">{scheme.name}</h5>
                                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">{scheme.category}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3">{scheme.description}</p>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-gray-500">{scheme.ministry}</span>
                                                <span className="font-medium text-purple-600">{scheme.coveragePercentage.toFixed(1)}% coverage</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Intervention Plan */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Intervention Plan</h4>
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                                    <ol className="space-y-2">
                                        {selectedCluster.interventionPlan.map((step, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                                    {idx + 1}
                                                </span>
                                                <span className="text-sm text-gray-700 pt-0.5">{step}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </div>

                            {/* Villages in Cluster */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Villages in this Cluster ({selectedCluster.villages.length})</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                                    {selectedCluster.villages.map((village) => (
                                        <div key={village.id} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-200">
                                            <div className="font-medium text-gray-900">{village.name}</div>
                                            <div className="text-xs text-gray-500">{village.block}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
