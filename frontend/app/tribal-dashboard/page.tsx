
'use client';

import { useState } from 'react';
import TribalHeader from './TribalHeader';
import FRAApplications from './FRAApplications';
import CommunityResources from './CommunityResources';
import TribalStats from './TribalStats';
import PersonalProfile from './PersonalProfile';

export default function TribalDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <TribalHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome, Ravi Oraon</h1>
              <p className="text-blue-100 mt-2">Khunti Village Community Member</p>
              <div className="flex items-center mt-3 space-x-4">
                <div className="flex items-center">
                  <i className="ri-map-pin-line mr-1"></i>
                  <span className="text-sm">Khunti, Jharkhand</span>
                </div>
                <div className="flex items-center">
                  <i className="ri-community-line mr-1"></i>
                  <span className="text-sm">Ho Tribe</span>
                </div>
              </div>
            </div>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-community-line text-4xl"></i>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'My Dashboard', icon: 'ri-dashboard-line' },
                { id: 'applications', name: 'FRA Applications', icon: 'ri-file-list-3-line' },
                { id: 'resources', name: 'Community Resources', icon: 'ri-tree-line' },
                { id: 'profile', name: 'My Profile', icon: 'ri-user-line' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className={`${tab.icon} mr-2`}></i>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && <TribalStats />}
          {activeTab === 'applications' && <FRAApplications />}
          {activeTab === 'resources' && <CommunityResources />}
          {activeTab === 'profile' && <PersonalProfile />}
        </div>
      </div>
    </div>
  );
}
