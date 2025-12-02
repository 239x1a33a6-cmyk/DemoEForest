
'use client';

export default function NGOStats() {
  const stats = [
    {
      title: 'Communities Supported',
      value: '18',
      change: '+3 this month',
      icon: 'ri-community-line',
      color: 'purple'
    },
    {
      title: 'Active Projects',
      value: '12',
      change: '2 completed recently',
      icon: 'ri-folder-line',
      color: 'pink'
    },
    {
      title: 'FRA Applications Assisted',
      value: '147',
      change: '+23 this month',
      icon: 'ri-file-text-line',
      color: 'indigo'
    },
    {
      title: 'Legal Support Cases',
      value: '34',
      change: '8 resolved',
      icon: 'ri-scales-line',
      color: 'violet'
    }
  ];

  const projects = [
    {
      name: 'Jharkhand FRA Awareness',
      communities: 8,
      status: 'Active',
      progress: 75,
      funding: '₹2.5L',
      location: 'Ranchi District'
    },
    {
      name: 'Odisha Community Rights',
      communities: 5,
      status: 'Planning',
      progress: 25,
      funding: '₹1.8L',
      location: 'Koraput District'
    },
    {
      name: 'Chhattisgarh Legal Aid',
      communities: 3,
      status: 'Active',
      progress: 60,
      funding: '₹1.2L',
      location: 'Bastar District'
    }
  ];

  const recentActivity = [
    {
      type: 'application',
      title: 'New FRA application submitted',
      community: 'Birsa Village, Ranchi',
      time: '2 hours ago',
      icon: 'ri-file-add-line',
      color: 'green'
    },
    {
      type: 'meeting',
      title: 'Community meeting conducted',
      community: 'Santhal Village, Dumka',
      time: '1 day ago',
      icon: 'ri-group-line',
      color: 'blue'
    },
    {
      type: 'training',
      title: 'Rights awareness workshop',
      community: 'Munda Village, Khunti',
      time: '3 days ago',
      icon: 'ri-presentation-line',
      color: 'purple'
    },
    {
      type: 'legal',
      title: 'Legal consultation provided',
      community: 'Oraon Village, Gumla',
      time: '5 days ago',
      icon: 'ri-scales-line',
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className={`text-xs text-${stat.color}-600 mt-1`}>{stat.change}</p>
              </div>
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                <i className={`${stat.icon} text-${stat.color}-600 text-xl`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Projects */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Active Projects</h3>
              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium whitespace-nowrap">
                View All
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {projects.map((project, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    <p className="text-sm text-gray-600">{project.location}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                    project.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>{project.communities} communities</span>
                  <span>{project.funding} budget</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{project.progress}% complete</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6 space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-8 h-8 bg-${activity.color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                  <i className={`${activity.icon} text-${activity.color}-600 text-sm`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.community}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
