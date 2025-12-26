'use client';

// FRAAnalyticsDashboard isn't available in this lightweight build environment.
// Provide a small placeholder so the page compiles during type-checks.
const FRAAnalyticsDashboard = () => (
    <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold">FRA Analytics Dashboard</h2>
        <p className="text-sm text-gray-600">Dashboard component not included in this environment.</p>
    </div>
);

export default function FRAAnalyticsPage() {
        return <FRAAnalyticsDashboard />;
}
