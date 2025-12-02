
'use client';

import { useState } from 'react';

export default function ProjectManagement() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showNewProject, setShowNewProject] = useState(false);

  const projects = [
    {
      id: 1,
      name: 'Jharkhand FRA Awareness Campaign',
      description: 'Comprehensive awareness program for forest rights in tribal villages',
      status: 'Active',
      progress: 75,
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      budget: 250000,
      spent: 187500,
      communities: ['Birsa Village', 'Santhal Village', 'Munda Village'],
      coordinator: 'Ram Kumar',
      activities: [
        { name: 'Community Meetings', completed: 8, total: 12 },
        { name: 'Documentation Support', completed: 15, total: 20 },
        { name: 'Legal Consultations', completed: 6, total: 8 }
      ],
      milestones: [
        { name: 'Initial Survey', status: 'completed', date: '2024-01-15' },
        { name: 'Community Mobilization', status: 'completed', date: '2024-02-01' },
        { name: 'FRA Applications', status: 'in-progress', date: '2024-03-15' },
        { name: 'Final Review', status: 'pending', date: '2024-06-01' }
      ]
    },
    {
      id: 2,
      name: 'Odisha Community Rights Support',
      description: 'Legal aid and documentation support for forest dwelling communities',
      status: 'Planning',
      progress: 25,
      startDate: '2024-02-01',
      endDate: '2024-08-31',
      budget: 180000,
      spent: 45000,
      communities: ['Kondh Village', 'Bonda Village'],
      coordinator: 'Maya Patra',
      activities: [
        { name: 'Baseline Survey', completed: 2, total: 5 },
        { name: 'Rights Education', completed: 1, total: 8 },
        { name: 'Application Filing', completed: 0, total: 12 }
      ],
      milestones: [
        { name: 'Project Initiation', status: 'completed', date: '2024-02-01' },
        { name: 'Community Mapping', status: 'in-progress', date: '2024-02-15' },
        { name: 'Capacity Building', status: 'pending', date: '2024-03-01' },
        { name: 'Implementation', status: 'pending', date: '2024-04-01' }
      ]
    },
    {
      id: 3,
      name: 'Chhattisgarh Legal Aid Initiative',
      description: 'Providing legal support for disputed forest land cases',
      status: 'Completed',
      progress: 100,
      startDate: '2023-09-01',
      endDate: '2024-01-31',
      budget: 120000,
      spent: 115000,
      communities: ['Gond Village', 'Baiga Village'],
      coordinator: 'Arjun Singh',
      activities: [
        { name: 'Case Documentation', completed: 8, total: 8 },
        { name: 'Court Hearings', completed: 12, total: 12 },
        { name: 'Settlement Negotiations', completed: 5, total: 5 }
      ],
      milestones: [
        { name: 'Case Filing', status: 'completed', date: '2023-09-15' },
        { name: 'Evidence Collection', status: 'completed', date: '2023-10-30' },
        { name: 'Court Proceedings', status: 'completed', date: '2023-12-15' },
        { name: 'Final Settlement', status: 'completed', date: '2024-01-20' }
      ]
    }
  ];

  const filteredProjects = projects.filter(project => {
    if (activeFilter === 'all') return true;
    return project.status.toLowerCase() === activeFilter.toLowerCase();
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'On Hold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMilestoneColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'pending': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Project Management</h3>
          <button 
            onClick={() => setShowNewProject(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 whitespace-nowrap"
          >
            <i className="ri-add-line mr-2"></i>
            New Project
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          {['all', 'active', 'planning', 'completed'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === filter
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Total Projects</p>
                <p className="text-2xl font-bold text-purple-900">{projects.length}</p>
              </div>
              <i className="ri-folder-line text-purple-600 text-2xl"></i>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Active</p>
                <p className="text-2xl font-bold text-green-900">
                  {projects.filter(p => p.status === 'Active').length}
                </p>
              </div>
              <i className="ri-play-circle-line text-green-600 text-2xl"></i>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Planning</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {projects.filter(p => p.status === 'Planning').length}
                </p>
              </div>
              <i className="ri-timer-line text-yellow-600 text-2xl"></i>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Budget</p>
                <p className="text-2xl font-bold text-blue-900">₹5.5L</p>
              </div>
              <i className="ri-money-rupee-circle-line text-blue-600 text-2xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{project.description}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span><i className="ri-calendar-line mr-1"></i>{project.startDate} - {project.endDate}</span>
                    <span><i className="ri-user-line mr-1"></i>{project.coordinator}</span>
                    <span><i className="ri-community-line mr-1"></i>{project.communities.length} communities</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <i className="ri-edit-line"></i>
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <i className="ri-more-2-line"></i>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Progress & Budget */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Overall Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Budget Utilization</span>
                      <span className="font-medium">₹{(project.spent / 1000).toFixed(0)}K / ₹{(project.budget / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(project.spent / project.budget) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Activities */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Key Activities</h4>
                  <div className="space-y-2">
                    {project.activities.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{activity.name}</span>
                        <span className="font-medium">{activity.completed}/{activity.total}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Milestones */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Milestones</h4>
                  <div className="space-y-2">
                    {project.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getMilestoneColor(milestone.status)}`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{milestone.name}</p>
                          <p className="text-xs text-gray-500">{milestone.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Communities */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Participating Communities</h4>
                <div className="flex flex-wrap gap-2">
                  {project.communities.map((community, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                      {community}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Project Modal */}
      {showNewProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New Project</h3>
              <button 
                onClick={() => setShowNewProject(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" rows="3"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                  <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowNewProject(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 whitespace-nowrap"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowNewProject(false)}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 whitespace-nowrap"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
