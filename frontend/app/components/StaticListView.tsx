// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration

import { useState, useEffect } from 'react';

interface DistrictData {
    district: string;
    village_count: number;
    total_potential: number;
}

interface StateData {
    state: string;
    districts: DistrictData[];
    total_villages: number;
    total_potential: number;
}

export default function StaticListView() {
    const [data, setData] = useState<StateData[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/static/list-view');
            const json = await res.json();
            if (json.success) {
                setData(json.data);
                // Expand all states by default
                setExpandedStates(new Set(json.data.map((s: StateData) => s.state)));
            }
        } catch (error) {
            console.error('Error fetching list view data:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleState = (state: string) => {
        const newExpanded = new Set(expandedStates);
        if (newExpanded.has(state)) {
            newExpanded.delete(state);
        } else {
            newExpanded.add(state);
        }
        setExpandedStates(newExpanded);
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading list view...</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
            {data.map((stateData) => (
                <div key={stateData.state} className="border-b border-gray-100 last:border-0">
                    <div
                        className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => toggleState(stateData.state)}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-gray-500">
                                {expandedStates.has(stateData.state) ? '▼' : '▶'}
                            </span>
                            <h3 className="text-lg font-semibold text-gray-900">{stateData.state}</h3>
                            <span className="text-sm text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                                {stateData.total_villages.toLocaleString()} villages
                            </span>
                        </div>
                        <div className="text-sm font-medium text-blue-600">
                            {(stateData.total_potential / 1000).toFixed(1)}K ha Potential
                        </div>
                    </div>

                    {expandedStates.has(stateData.state) && (
                        <div className="p-4 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {stateData.districts.map((district) => (
                                    <div key={district.district} className="p-3 rounded-lg border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-medium text-gray-900">{district.district}</h4>
                                            <span className="text-xs font-medium text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded">
                                                {district.village_count}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {(district.total_potential).toFixed(1)} ha Potential
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {data.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                    No data available. Please upload datasets.
                </div>
            )}
        </div>
    );
}
