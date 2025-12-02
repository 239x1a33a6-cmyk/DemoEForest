
'use client';

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'grant',
      message: 'IFR title granted to Ramesh Kumar in Raigarh District, Chhattisgarh',
      time: '2 hours ago',
      icon: 'ri-award-line',
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 2,
      type: 'verification',
      message: 'CFR verification completed for Bhilwara tribal community, Rajasthan',
      time: '4 hours ago',
      icon: 'ri-shield-check-line',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 3,
      type: 'claim',
      message: 'New CR claim submitted from Koraput District, Odisha',
      time: '6 hours ago',
      icon: 'ri-file-add-line',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 4,
      type: 'survey',
      message: 'Asset mapping survey initiated in 15 villages of Bastar District',
      time: '8 hours ago',
      icon: 'ri-map-pin-line',
      color: 'text-orange-600 bg-orange-100'
    },
    {
      id: 5,
      type: 'processing',
      message: 'Batch processing of 340 IFR claims started in Sundargarh District',
      time: '12 hours ago',
      icon: 'ri-refresh-line',
      color: 'text-indigo-600 bg-indigo-100'
    },
    {
      id: 6,
      type: 'digitization',
      message: 'Legacy documents digitization completed for Dantewada Block',
      time: '1 day ago',
      icon: 'ri-scan-line',
      color: 'text-teal-600 bg-teal-100'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-green-600 hover:text-green-700 cursor-pointer whitespace-nowrap">
          View all
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${activity.color}`}>
              <i className={`${activity.icon} text-sm`}></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
