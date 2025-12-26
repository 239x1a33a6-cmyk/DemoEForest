
'use client';

import { useState } from 'react';
import NGOHeader from './NGOHeader';
import CommunityInsights from './CommunityInsights';
import ProjectManagement from './ProjectManagement';
import NGOStats from './NGOStats';
import AdvocacyTools from './AdvocacyTools';

export default function NGODashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <NGOHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-700 rounded-xl p-6 text-white mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Green Earth NGO Dashboard</h1>
              <p className="text-purple-100 mt-2">Supporting tribal communities in forest rights advocacy</p>
              <div className="flex items-center mt-3 space-x-4">
                <div className="flex items-center">
                  <i className="ri-map-pin-line mr-1"></i>
                  <span className="text-sm">Ranchi, Jharkhand</span>
                </div>
                <div className="flex items-center">
                  <i className="ri-calendar-line mr-1"></i>
                  <span className="text-sm">Working since 2018</span>
                </div>
              </div>
            </div>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-hand-heart-line text-4xl"></i>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: 'ri-dashboard-line' },
                { id: 'communities', name: 'Community Insights', icon: 'ri-community-line' },
                { id: 'projects', name: 'Project Management', icon: 'ri-folder-line' },
                { id: 'advocacy', name: 'Advocacy Tools', icon: 'ri-megaphone-line' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
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
          {activeTab === 'overview' && <NGOStats />}
          {activeTab === 'communities' && <CommunityInsights />}
          {activeTab === 'projects' && <ProjectManagement />}
          {activeTab === 'advocacy' && <AdvocacyTools />}
        </div>
      </div>
    </div>
  );
}
