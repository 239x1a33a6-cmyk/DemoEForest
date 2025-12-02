
import DashboardStats from './DashboardStats';
import ProgressCharts from './ProgressCharts';
import RecentActivity from './RecentActivity';
import StateOverview from './StateOverview';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FRA Dashboard</h1>
          <p className="text-gray-600">Real-time insights and progress tracking for Forest Rights Act implementation</p>
        </div>

        <DashboardStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ProgressCharts />
          <StateOverview />
        </div>

        <RecentActivity />
      </div>
    </div>
  );
}
