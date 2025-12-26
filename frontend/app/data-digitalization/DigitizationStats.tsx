// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration

'use client';

export default function DigitizationStats() {
  const stats = [
    {
      title: 'Documents Processed',
      value: '15,847',
      change: '+234 today',
      icon: 'ri-file-text-line',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Entities Extracted',
      value: '342,567',
      change: '96% accuracy',
      icon: 'ri-search-eye-line',
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Processing Queue',
      value: '23',
      change: '~15 min wait',
      icon: 'ri-time-line',
      color: 'text-orange-600 bg-orange-100'
    },
    {
      title: 'Success Rate',
      value: '94.7%',
      change: '+2.1% this week',
      icon: 'ri-checkbox-circle-line',
      color: 'text-purple-600 bg-purple-100'
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
              <p className="text-sm text-gray-500 mt-2">{stat.change}</p>
            </div>
            <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${stat.color}`}>
              <i className={`${stat.icon} text-xl`}></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
