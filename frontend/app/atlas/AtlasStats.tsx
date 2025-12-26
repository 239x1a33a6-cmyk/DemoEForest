
'use client';

export default function AtlasStats() {
  const stats = [
    {
      title: 'Total FRA Claims',
      value: '2,547,892',
      change: '+12.5%',
      trend: 'up',
      icon: 'ri-file-list-3-line'
    },
    {
      title: 'Villages Mapped',
      value: '15,234',
      change: '+8.3%',
      trend: 'up',
      icon: 'ri-map-pin-2-line'
    },
    {
      title: 'Forest Area (km²)',
      value: '234,567',
      change: '+2.1%',
      trend: 'up',
      icon: 'ri-plant-line'
    },
    {
      title: 'Approved Claims',
      value: '1,656,130',
      change: '+15.7%',
      trend: 'up',
      icon: 'ri-checkbox-circle-line'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className={`${stat.icon} text-2xl text-green-600`}></i>
            </div>
            <div className={`flex items-center text-sm ${
              stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <div className="w-4 h-4 flex items-center justify-center mr-1">
                <i className={stat.trend === 'up' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'}></i>
              </div>
              {stat.change}
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {stat.value}
          </div>
          <div className="text-sm text-gray-600">
            {stat.title}
          </div>
        </div>
      ))}
    </div>
  );
}
