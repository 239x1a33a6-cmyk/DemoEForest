
'use client';

import { useState } from 'react';

export default function ForestStats() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [showDetailedView, setShowDetailedView] = useState<string | null>(null);

  const quickActions = [
    {
      id: 'pending-applications',
      title: 'Pending Applications',
      count: 15,
      icon: 'ri-file-list-3-line',
      color: 'bg-yellow-100 text-yellow-800',
      description: 'FRA applications awaiting review'
    },
    {
      id: 'field-visits',
      title: 'Field Visits Scheduled',
      count: 8,
      icon: 'ri-map-pin-line',
      color: 'bg-blue-100 text-blue-800',
      description: 'Upcoming site inspections'
    },
    {
      id: 'document-verification',
      title: 'Document Verification',
      count: 12,
      icon: 'ri-file-check-line',
      color: 'bg-purple-100 text-purple-800',
      description: 'Documents requiring verification'
    },
    {
      id: 'community-meetings',
      title: 'Community Meetings',
      count: 3,
      icon: 'ri-group-line',
      color: 'bg-green-100 text-green-800',
      description: 'Scheduled community consultations'
    }
  ];

  const recentActivities = {
    today: [
      { id: 1, type: 'application', title: 'New FRA application submitted', user: 'Ravi Oraon', time: '2 hours ago', status: 'new' },
      { id: 2, type: 'verification', title: 'Document verification completed', user: 'Sita Munda', time: '4 hours ago', status: 'completed' },
      { id: 3, type: 'approval', title: 'Application approved', user: 'Ram Singh', time: '6 hours ago', status: 'approved' }
    ],
    week: [
      { id: 4, type: 'application', title: 'Community forest rights application', user: 'Khunti Village Committee', time: '2 days ago', status: 'new' },
      { id: 5, type: 'field-visit', title: 'Field visit completed', user: 'Survey Team A', time: '3 days ago', status: 'completed' },
      { id: 6, type: 'meeting', title: 'Community meeting conducted', user: 'Village Panchayat', time: '5 days ago', status: 'completed' }
    ],
    month: [
      { id: 7, type: 'approval', title: 'Bulk applications processed', user: 'District Office', time: '1 week ago', status: 'approved' },
      { id: 8, type: 'training', title: 'Staff training completed', user: 'Forest Department', time: '2 weeks ago', status: 'completed' },
      { id: 9, type: 'audit', title: 'Quarterly audit conducted', user: 'State Office', time: '3 weeks ago', status: 'completed' }
    ]
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'application': return 'ri-file-add-line';
      case 'verification': return 'ri-shield-check-line';
      case 'approval': return 'ri-check-double-line';
      case 'field-visit': return 'ri-map-pin-line';
      case 'meeting': return 'ri-group-line';
      case 'training': return 'ri-graduation-cap-line';
      case 'audit': return 'ri-search-line';
      default: return 'ri-information-line';
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleQuickActionClick = (actionId: string) => {
    setShowDetailedView(actionId);
  };

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-check-line text-2xl text-green-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">156</p>
              <p className="text-sm text-gray-600">Applications Approved</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-2xl text-yellow-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">23</p>
              <p className="text-sm text-gray-600">Pending Review</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-community-line text-2xl text-blue-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">45</p>
              <p className="text-sm text-gray-600">Active Communities</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-map-2-line text-2xl text-purple-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">2,847</p>
              <p className="text-sm text-gray-600">Total Acres Granted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <div 
              key={action.id}
              onClick={() => handleQuickActionClick(action.id)}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                  <i className={`${action.icon} text-xl`}></i>
                </div>
                <span className="text-2xl font-bold text-gray-900">{action.count}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 pr-8"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
        
        <div className="space-y-4">
          {recentActivities[selectedPeriod as keyof typeof recentActivities]?.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <i className={`${getActivityIcon(activity.type)} text-lg text-gray-600`}></i>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{activity.title}</h4>
                    <p className="text-sm text-gray-600">by {activity.user}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.status)}`}>
                      {activity.status}
                    </span>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed View Modal */}
      {showDetailedView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {quickActions.find(a => a.id === showDetailedView)?.title} Details
                </h3>
                <button
                  onClick={() => setShowDetailedView(null)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {/* Sample detailed content based on action type */}
                {showDetailedView === 'pending-applications' && (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div key={item} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">FRA/2024/KHU/00{item}</h4>
                            <p className="text-sm text-gray-600">Individual Forest Rights - Applicant Name</p>
                            <p className="text-xs text-gray-500">Submitted: 2024-01-{15 + item}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 cursor-pointer whitespace-nowrap">
                              Review
                            </button>
                            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 cursor-pointer whitespace-nowrap">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {showDetailedView === 'field-visits' && (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">Site Visit - Location {item}</h4>
                            <p className="text-sm text-gray-600">Scheduled for: 2024-02-{20 + item}</p>
                            <p className="text-xs text-gray-500">Survey Team: Team {item}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 cursor-pointer whitespace-nowrap">
                              Reschedule
                            </button>
                            <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 cursor-pointer whitespace-nowrap">
                              Complete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
