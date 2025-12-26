
'use client';

import { useState } from 'react';

export default function CommunityInsights() {
  const [selectedState, setSelectedState] = useState('all');

  const communities = [
    {
      name: 'Birsa Village',
      location: 'Ranchi, Jharkhand',
      population: 245,
      households: 52,
      fraStatus: 'Pending Review',
      applications: 15,
      issues: ['Land Documentation', 'Forest Access'],
      coordinator: 'Ram Kumar',
      lastVisit: '2024-01-15',
      progress: 65
    },
    {
      name: 'Santhal Village',
      location: 'Dumka, Jharkhand',
      population: 180,
      households: 38,
      fraStatus: 'Approved',
      applications: 12,
      issues: ['Water Rights', 'Grazing Permission'],
      coordinator: 'Sita Devi',
      lastVisit: '2024-01-10',
      progress: 90
    },
    {
      name: 'Munda Village',
      location: 'Khunti, Jharkhand',
      population: 320,
      households: 68,
      fraStatus: 'In Process',
      applications: 22,
      issues: ['Title Verification', 'Boundary Demarcation'],
      coordinator: 'Arjun Singh',
      lastVisit: '2024-01-08',
      progress: 45
    },
    {
      name: 'Kondh Village',
      location: 'Koraput, Odisha',
      population: 156,
      households: 29,
      fraStatus: 'Documentation',
      applications: 8,
      issues: ['Survey Records', 'Traditional Evidence'],
      coordinator: 'Maya Patra',
      lastVisit: '2024-01-12',
      progress: 30
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-800';
      case 'In Process': return 'bg-blue-100 text-blue-800';
      case 'Documentation': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const insights = [
    {
      title: 'Most Common Issues',
      data: [
        { issue: 'Land Documentation', count: 12, percentage: 35 },
        { issue: 'Boundary Demarcation', count: 8, percentage: 25 },
        { issue: 'Forest Access Rights', count: 7, percentage: 20 },
        { issue: 'Water Rights', count: 5, percentage: 15 },
        { issue: 'Grazing Permission', count: 2, percentage: 5 }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Community Overview</h3>
          <div className="flex items-center space-x-4">
            <select 
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-8"
            >
              <option value="all">All States</option>
              <option value="jharkhand">Jharkhand</option>
              <option value="odisha">Odisha</option>
              <option value="chhattisgarh">Chhattisgarh</option>
            </select>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 whitespace-nowrap">
              <i className="ri-download-line mr-2"></i>
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Total Communities</p>
                <p className="text-2xl font-bold text-purple-900">18</p>
              </div>
              <i className="ri-community-line text-purple-600 text-2xl"></i>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">FRA Approved</p>
                <p className="text-2xl font-bold text-green-900">6</p>
              </div>
              <i className="ri-checkbox-circle-line text-green-600 text-2xl"></i>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">In Process</p>
                <p className="text-2xl font-bold text-yellow-900">9</p>
              </div>
              <i className="ri-timer-line text-yellow-600 text-2xl"></i>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Population</p>
                <p className="text-2xl font-bold text-blue-900">2,847</p>
              </div>
              <i className="ri-group-line text-blue-600 text-2xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Communities List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Supported Communities</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {communities.map((community, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{community.name}</h4>
                    <p className="text-sm text-gray-600">{community.location}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(community.fraStatus)}`}>
                    {community.fraStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Population</p>
                    <p className="font-medium text-gray-900">{community.population}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Households</p>
                    <p className="font-medium text-gray-900">{community.households}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Applications</p>
                    <p className="font-medium text-gray-900">{community.applications}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Coordinator</p>
                    <p className="font-medium text-gray-900">{community.coordinator}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">Key Issues</p>
                  <div className="flex flex-wrap gap-1">
                    {community.issues.map((issue, i) => (
                      <span key={i} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                        {issue}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{community.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${community.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <button className="text-purple-600 hover:text-purple-700 text-sm font-medium whitespace-nowrap">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Key Insights</h3>
            </div>
            <div className="p-6">
              <h4 className="font-medium text-gray-900 mb-4">Most Common Issues</h4>
              <div className="space-y-3">
                {insights[0].data.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{item.issue}</span>
                      <span className="text-gray-900 font-medium">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 whitespace-nowrap">
                <i className="ri-calendar-line mr-2"></i>
                Schedule Community Visit
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 whitespace-nowrap">
                <i className="ri-phone-line mr-2"></i>
                Contact Coordinator
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 whitespace-nowrap">
                <i className="ri-file-add-line mr-2"></i>
                Add New Community
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
