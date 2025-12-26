// Static Dataset Dashboard Fix — Data source path restored

// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Static CFR Dataset Dashboard Content
 * Reusable component for displaying static data visualization
 */
export default function StaticDashboardContent() {
    const [districtData, setDistrictData] = useState<any[]>([]);
    const [priorityData, setPriorityData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedState, setSelectedState] = useState<string>('Odisha'); // Default to Odisha
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, [selectedState]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [districtRes, priorityRes] = await Promise.all([
                fetch(`/api/static/district-summary?state=${selectedState}`),
                fetch(`/api/static/cfr-priority?state=${selectedState}`)
            ]);

            const districtJson = await districtRes.json();
            const priorityJson = await priorityRes.json();

            if (districtJson.success) {
                setDistrictData(districtJson.data);
            } else {
                setError('Failed to load district data');
            }

            if (priorityJson.success) {
                setPriorityData(priorityJson.data);
            } else {
                setError('Failed to load priority data');
            }



        } catch (error) {
            console.error('Error fetching data:', error);
            setError('No static data available currently');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading static dataset...</p>
                </div>
            </div>
        );
    }

    // Show error message if data failed to load
    if (error || districtData.length === 0) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-600 font-medium">{error || 'No static data available currently'}</p>
                    <button
                        onClick={() => fetchData()}
                        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const prioritySummary = priorityData?.priority_summary || [];
    const pieData = prioritySummary.map((item: any) => ({
        name: item.priority_category,
        value: item.village_count
    }));

    const COLORS = {
        High: '#dc2626',
        Medium: '#f59e0b',
        Low: '#16a34a'
    };

    const topDistricts = districtData.slice(0, 10);

    return (
        <div className="space-y-8">
            {/* Header Actions */}
            <div className="flex justify-between items-center bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div>
                    <h3 className="text-lg font-bold text-purple-900">Static Dataset Overview</h3>
                    <p className="text-sm text-purple-700">
                        {selectedState === 'Madhya Pradesh' && 'Analysis of 19,158 villages in Madhya Pradesh'}
                        {selectedState === 'Maharashtra' && 'Analysis of 17,255 villages in Maharashtra'}
                        {selectedState === 'Odisha' && 'Analysis of 26,095 villages in Odisha'}
                    </p>
                </div>
                <div className="flex gap-4 items-center">
                    {/* State Selector */}
                    <select
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        className="px-4 py-2 bg-white border border-purple-200 rounded-lg text-sm font-medium text-gray-700 hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Odisha">Odisha</option>
                    </select>
                    <div className="flex gap-4">
                        <button
                            onClick={() => router.push('/static-upload')}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium flex items-center gap-2"
                            title="Upload a new Excel file to add or update static CFR data for any state"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Upload New Data
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                        <p className="text-sm text-gray-600 mb-1">Total Villages</p>
                        <p className="text-3xl font-bold text-gray-900">
                            {districtData.reduce((sum, d) => sum + d.total_villages, 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                        <p className="text-sm text-gray-600 mb-1">Eligible Villages</p>
                        <p className="text-3xl font-bold text-green-600">
                            {districtData.reduce((sum, d) => sum + d.eligible_villages, 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                        <p className="text-sm text-gray-600 mb-1">Total CFR Potential</p>
                        <p className="text-3xl font-bold text-blue-600">
                            {(districtData.reduce((sum, d) => sum + (d.total_cfr_potential || 0), 0) / 1000).toFixed(0)}K ha
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                        <p className="text-sm text-gray-600 mb-1">Districts</p>
                        <p className="text-3xl font-bold text-purple-600">
                            {districtData.length}
                        </p>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Priority Distribution Pie Chart */}
                    <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            CFR Priority Distribution
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Top Districts by CFR Potential */}
                    <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Top 10 Districts by CFR Potential
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={topDistricts}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="district" angle={-45} textAnchor="end" height={100} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="total_cfr_potential" fill="#16a34a" name="CFR Potential (ha)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* High Priority Villages Table */}
                {priorityData?.high_priority_villages && (
                    <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Top High Priority Villages
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">District</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Taluka</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Village</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Priority Score</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">CFR Potential (ha)</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">ST Population</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {priorityData.high_priority_villages.slice(0, 20).map((village: any, index: number) => (
                                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-gray-900">{village.district}</td>
                                            <td className="py-3 px-4 text-sm text-gray-900">{village.taluka}</td>
                                            <td className="py-3 px-4 text-sm text-gray-900">{village.village}</td>
                                            <td className="py-3 px-4 text-sm text-right font-semibold text-red-600">
                                                {village.cfr_priority_score?.toFixed(1)}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-right text-gray-900">
                                                {village.total_cfr_potential?.toFixed(1)}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-right text-gray-900">
                                                {village.st_population}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </>
        </div>
    );
}
