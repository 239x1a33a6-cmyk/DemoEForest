
'use client';

export default function CommunityResources() {
  const resources = [
    {
      id: 1,
      title: 'Traditional Medicinal Plants',
      category: 'Healthcare',
      description: 'Comprehensive guide to medicinal plants found in our forest area',
      access: 'community',
      downloads: 234,
      icon: 'ri-leaf-line',
      color: 'green'
    },
    {
      id: 2,
      title: 'Sustainable Farming Practices',
      category: 'Agriculture',
      description: 'Traditional and modern farming techniques for forest land',
      access: 'community',
      downloads: 189,
      icon: 'ri-plant-line',
      color: 'blue'
    },
    {
      id: 3,
      title: 'Forest Conservation Guidelines',
      category: 'Conservation',
      description: 'Community guidelines for protecting our forest resources',
      access: 'public',
      downloads: 156,
      icon: 'ri-tree-line',
      color: 'purple'
    },
    {
      id: 4,
      title: 'Legal Rights Documentation',
      category: 'Legal',
      description: 'Understanding your forest rights under FRA 2006',
      access: 'community',
      downloads: 298,
      icon: 'ri-scales-3-line',
      color: 'orange'
    }
  ];

  const communityProjects = [
    {
      id: 1,
      title: 'Community Forest Management',
      status: 'ongoing',
      participants: 45,
      startDate: '2024-01-01',
      description: 'Collective management of 50 acres of community forest land',
      progress: 65
    },
    {
      id: 2,
      title: 'Water Conservation Initiative',
      status: 'ongoing',
      participants: 32,
      startDate: '2023-12-15',
      description: 'Building check dams and water harvesting structures',
      progress: 80
    },
    {
      id: 3,
      title: 'Medicinal Plant Cultivation',
      status: 'completed',
      participants: 28,
      startDate: '2023-11-01',
      description: 'Cultivating traditional medicinal plants for community use',
      progress: 100
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-600';
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'purple': return 'bg-purple-100 text-purple-600';
      case 'orange': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'planned': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Community Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <i className="ri-book-line text-2xl text-green-600 mr-3"></i>
              <div>
                <p className="text-2xl font-bold text-green-900">24</p>
                <p className="text-sm text-green-700">Resources Available</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <i className="ri-group-line text-2xl text-blue-600 mr-3"></i>
              <div>
                <p className="text-2xl font-bold text-blue-900">3</p>
                <p className="text-sm text-blue-700">Active Projects</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center">
              <i className="ri-user-line text-2xl text-purple-600 mr-3"></i>
              <div>
                <p className="text-2xl font-bold text-purple-900">105</p>
                <p className="text-sm text-purple-700">Community Members</p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center">
              <i className="ri-download-line text-2xl text-orange-600 mr-3"></i>
              <div>
                <p className="text-2xl font-bold text-orange-900">877</p>
                <p className="text-sm text-orange-700">Total Downloads</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Library */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Resource Library</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium cursor-pointer whitespace-nowrap">
                All Categories
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm cursor-pointer whitespace-nowrap">
                Healthcare
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm cursor-pointer whitespace-nowrap">
                Agriculture
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource) => (
              <div key={resource.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(resource.color)}`}>
                    <i className={`${resource.icon} text-xl`}></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">{resource.title}</h4>
                        <p className="text-xs text-gray-500 mb-2">{resource.category}</p>
                        <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        resource.access === 'community' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {resource.access}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <i className="ri-download-line mr-1"></i>
                        {resource.downloads} downloads
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer whitespace-nowrap">
                          View
                        </button>
                        <button className="text-green-600 hover:text-green-800 text-sm cursor-pointer whitespace-nowrap">
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Community Projects */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Community Projects</h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {communityProjects.map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                    {project.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Participants</p>
                    <p className="text-sm font-semibold text-gray-900">{project.participants} members</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Start Date</p>
                    <p className="text-sm font-semibold text-gray-900">{project.startDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Progress</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{project.progress}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer whitespace-nowrap">
                      View Details
                    </button>
                    <button className="text-green-600 hover:text-green-800 text-sm font-medium cursor-pointer whitespace-nowrap">
                      Join Project
                    </button>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <i className="ri-group-line mr-1"></i>
                    {project.participants} participants
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Knowledge Sharing */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Knowledge Sharing</h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <i className="ri-lightbulb-line text-2xl text-green-600 mr-3"></i>
                <h4 className="text-lg font-semibold text-gray-900">Share Your Knowledge</h4>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Share your traditional knowledge and practices with the community
              </p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer whitespace-nowrap">
                <i className="ri-upload-line mr-2"></i>
                Upload Resource
              </button>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <i className="ri-question-answer-line text-2xl text-purple-600 mr-3"></i>
                <h4 className="text-lg font-semibold text-gray-900">Ask Questions</h4>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Get help from community members and experts
              </p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 cursor-pointer whitespace-nowrap">
                <i className="ri-chat-3-line mr-2"></i>
                Ask Question
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
