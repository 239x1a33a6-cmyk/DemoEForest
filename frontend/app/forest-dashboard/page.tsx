'use client';

import { useState } from 'react';
import ForestHeader from './ForestHeader';
import UserManagement from './UserManagement';
import CommunityRecords from './CommunityRecords';
import ForestStats from './ForestStats';
import SystemAlerts from './SystemAlerts';

export default function ForestDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <ForestHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Forest Officer Dashboard</h1>
              <p className="text-green-100 mt-2">Administrative portal for forest management and community oversight</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-shield-user-line text-3xl"></i>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: 'ri-dashboard-line' },
                { id: 'users', name: 'User Management', icon: 'ri-user-settings-line' },
                { id: 'records', name: 'Community Records', icon: 'ri-file-list-3-line' },
                { id: 'alerts', name: 'System Alerts', icon: 'ri-alarm-warning-line' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
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
          {activeTab === 'overview' && <ForestStats />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'records' && <CommunityRecords />}
          {activeTab === 'alerts' && <SystemAlerts />}
        </div>
      </div>
    </div>
  );
}