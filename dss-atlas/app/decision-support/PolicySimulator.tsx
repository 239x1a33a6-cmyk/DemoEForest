'use client';

import { useState } from 'react';
import { SimulationResult, PolicyWeights } from '@/types/dss';

const PRESET_SCENARIOS = {
    'water-focus': { name: 'Water Security Focus', weights: { water: 0.6, livelihood: 0.25, ecological: 0.15 } },
    'livelihood-focus': { name: 'Livelihood Enhancement', weights: { water: 0.25, livelihood: 0.55, ecological: 0.2 } },
    'ecological-focus': { name: 'Ecological Conservation', weights: { water: 0.2, livelihood: 0.25, ecological: 0.55 } },
    'balanced': { name: 'Balanced Development', weights: { water: 0.33, livelihood: 0.34, ecological: 0.33 } }
};

export default function PolicySimulator() {
    const [weights, setWeights] = useState<PolicyWeights>({ water: 0.4, livelihood: 0.3, ecological: 0.3 });
    const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState<string>('');

    const handleWeightChange = (key: keyof PolicyWeights, value: number) => {
        const newWeights = { ...weights, [key]: value };

        // Ensure weights sum to 1.0
        const sum = newWeights.water + newWeights.livelihood + newWeights.ecological;
        if (Math.abs(sum - 1.0) > 0.01) {
            // Auto-adjust other weights proportionally
            const remaining = 1.0 - value;
            const otherKeys = Object.keys(newWeights).filter(k => k !== key) as (keyof PolicyWeights)[];
            const otherSum = otherKeys.reduce((s, k) => s + newWeights[k], 0);

            if (otherSum > 0) {
                otherKeys.forEach(k => {
                    newWeights[k] = (newWeights[k] / otherSum) * remaining;
                });
            }
        }

        setWeights(newWeights);
        setSelectedPreset('');
    };

    const applyPreset = (presetKey: string) => {
        const preset = PRESET_SCENARIOS[presetKey as keyof typeof PRESET_SCENARIOS];
        if (preset) {
            setWeights(preset.weights);
            setSelectedPreset(presetKey);
        }
    };

    const runSimulation = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/dss/simulator', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    weights,
                    scenarioName: selectedPreset ? PRESET_SCENARIOS[selectedPreset as keyof typeof PRESET_SCENARIOS].name : 'Custom Scenario'
                })
            });

            const result = await response.json();
            if (result.success) {
                setSimulationResult(result.data);
            }
        } catch (error) {
            console.error('Error running simulation:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <i className="ri-settings-3-line text-3xl"></i>
                    <h2 className="text-2xl font-bold">What-If Policy Simulator</h2>
                </div>
                <p className="text-indigo-100">
                    Test different policy scenarios and visualize their impact on village prioritization
                </p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Policy Weights</h3>

                {/* Preset Scenarios */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Quick Presets</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(PRESET_SCENARIOS).map(([key, scenario]) => (
                            <button
                                key={key}
                                onClick={() => applyPreset(key)}
                                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${selectedPreset === key
                                        ? 'bg-indigo-600 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {scenario.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Weight Sliders */}
                <div className="space-y-6">
                    {/* Water */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <i className="ri-water-flash-line text-blue-600"></i>
                                Water Vulnerability
                            </label>
                            <span className="text-sm font-bold text-blue-600">{(weights.water * 100).toFixed(0)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={weights.water}
                            onChange={(e) => handleWeightChange('water', parseFloat(e.target.value))}
                            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>

                    {/* Livelihood */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <i className="ri-plant-line text-green-600"></i>
                                Livelihood Vulnerability
                            </label>
                            <span className="text-sm font-bold text-green-600">{(weights.livelihood * 100).toFixed(0)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={weights.livelihood}
                            onChange={(e) => handleWeightChange('livelihood', parseFloat(e.target.value))}
                            className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                        />
                    </div>

                    {/* Ecological */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <i className="ri-leaf-line text-emerald-600"></i>
                                Ecological Sensitivity
                            </label>
                            <span className="text-sm font-bold text-emerald-600">{(weights.ecological * 100).toFixed(0)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={weights.ecological}
                            onChange={(e) => handleWeightChange('ecological', parseFloat(e.target.value))}
                            className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                        />
                    </div>
                </div>

                {/* Total Check */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">Total Weight:</span>
                        <span className={`font-bold ${Math.abs((weights.water + weights.livelihood + weights.ecological) - 1.0) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                            {((weights.water + weights.livelihood + weights.ecological) * 100).toFixed(0)}%
                        </span>
                    </div>
                </div>

                <button
                    onClick={runSimulation}
                    disabled={loading}
                    className="mt-6 w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <i className="ri-loader-4-line animate-spin"></i>
                            Running Simulation...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <i className="ri-play-line"></i>
                            Run Simulation
                        </span>
                    )}
                </button>
            </div>

            {/* Results */}
            {simulationResult && (
                <div className="space-y-6">
                    {/* Impact Summary */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Impact Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-4 bg-indigo-50 rounded-lg">
                                <div className="text-3xl font-bold text-indigo-600">{simulationResult.impactSummary.totalVillagesAffected}</div>
                                <div className="text-sm text-gray-600 mt-1">Villages Affected</div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <div className="text-3xl font-bold text-purple-600">{simulationResult.impactSummary.avgPriorityChange.toFixed(1)}</div>
                                <div className="text-sm text-gray-600 mt-1">Avg Priority Change</div>
                            </div>
                            <div className="text-center p-4 bg-pink-50 rounded-lg">
                                <div className="text-3xl font-bold text-pink-600">₹{(simulationResult.budgetRequirement / 10000000).toFixed(1)}Cr</div>
                                <div className="text-sm text-gray-600 mt-1">Budget Required</div>
                            </div>
                        </div>
                    </div>

                    {/* Top Movers */}
                    {simulationResult.impactSummary.topMovers.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <i className="ri-arrow-up-line text-green-600"></i>
                                Top Priority Movers
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                                {simulationResult.impactSummary.topMovers.map((village, idx) => (
                                    <div key={idx} className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                                        <div className="text-xs text-gray-500 mb-1">#{idx + 1}</div>
                                        <div className="font-medium text-gray-900 text-sm">{village}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Budget Reallocation */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Budget Reallocation</h3>
                        <div className="space-y-4">
                            {simulationResult.impactSummary.budgetReallocation.map((item, idx) => (
                                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-gray-900">{item.category}</h4>
                                        <span className={`text-sm font-medium ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {item.change >= 0 ? '+' : ''}{item.change.toFixed(1)} Cr
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Original:</span>
                                            <span className="ml-2 font-medium">₹{item.originalAllocation.toFixed(1)}Cr</span>
                                        </div>
                                        <i className="ri-arrow-right-line text-gray-400"></i>
                                        <div>
                                            <span className="text-gray-600">New:</span>
                                            <span className="ml-2 font-medium">₹{item.newAllocation.toFixed(1)}Cr</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Priority Villages */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Top Priority Villages ({simulationResult.topPriorityVillages.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                            {simulationResult.topPriorityVillages.map((village, idx) => (
                                <div key={village.id} className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">#{idx + 1}</span>
                                                <h4 className="font-semibold text-gray-900">{village.name}</h4>
                                            </div>
                                            <div className="text-sm text-gray-600">{village.district}, {village.block}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-indigo-600">{village.vulnerabilityScores.overall.toFixed(1)}</div>
                                            <div className="text-xs text-gray-500">Score</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
