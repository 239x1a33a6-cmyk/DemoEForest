
'use client';

export default function DashboardStats() {
  const stats = [
    {
      title: 'Total Claims',
      value: '2,847,592',
      change: '+12.5%',
      changeType: 'increase',
      icon: 'ri-file-text-line'
    },
    {
      title: 'Titles Granted',
      value: '1,923,847',
      change: '+8.3%',
      changeType: 'increase',
      icon: 'ri-award-line'
    },
    {
      title: 'Under Processing',
      value: '623,745',
      change: '-5.2%',
      changeType: 'decrease',
      icon: 'ri-time-line'
    },
    {
      title: 'Villages Covered',
      value: '186,429',
      change: '+15.7%',
      changeType: 'increase',
      icon: 'ri-community-line'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
            <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${
              stat.changeType === 'increase' ? 'bg-green-100' : 'bg-blue-100'
            }`}>
              <i className={`${stat.icon} text-xl ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-blue-600'
              }`}></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
