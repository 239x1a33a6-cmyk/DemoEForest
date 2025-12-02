'use client';

import { useState } from 'react';
import DSSStats from './DSSStats';
import SpatialDecisionEngine from './SpatialDecisionEngine';
import AIRecommendationEngine from './AIRecommendationEngine';
import SchemeEligibilityEngine from './SchemeEligibilityEngine';
import PolicySimulator from './PolicySimulator';

type TabType = 'spatial' | 'ai-recommendations' | 'eligibility' | 'simulator';

export default function DecisionSupportPage() {
  const [activeTab, setActiveTab] = useState<TabType>('spatial');

  const tabs = [
    {
      id: 'spatial' as TabType,
      name: 'Spatial Decision Engine',
      icon: 'ri-map-2-line',
      description: 'Interactive WebGIS with vulnerability heatmaps'
    },
    {
      id: 'ai-recommendations' as TabType,
      name: 'AI Recommendations',
      icon: 'ri-brain-line',
      description: 'ML-powered village clustering & schemes'
    },
    {
      id: 'eligibility' as TabType,
      name: 'Eligibility Checker',
      icon: 'ri-checkbox-circle-line',
      description: 'Rule-based eligibility assessment'
    },
    {
      id: 'simulator' as TabType,
      name: 'Policy Simulator',
      icon: 'ri-settings-3-line',
      description: 'What-if policy scenario testing'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
              <i className="ri-dashboard-3-line text-3xl text-white"></i>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Decision Support System
              </h1>
              <p className="text-gray-600 mt-1">
                AI-driven spatial analytics for FRA & tribal development
              </p>
            </div>
          </div>
        </div>

        {/* KPI Stats */}
        <DSSStats />

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-4 rounded-lg text-left transition-all ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <i className={`${tab.icon} text-2xl`}></i>
                  <h3 className="font-bold text-sm">{tab.name}</h3>
                </div>
                <p className={`text-xs ${activeTab === tab.id ? 'text-blue-100' : 'text-gray-500'}`}>
                  {tab.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">
          {activeTab === 'spatial' && <SpatialDecisionEngine />}
          {activeTab === 'ai-recommendations' && <AIRecommendationEngine />}
          {activeTab === 'eligibility' && <SchemeEligibilityEngine />}
          {activeTab === 'simulator' && <PolicySimulator />}
        </div>

        {/* Footer Info */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <i className="ri-information-line"></i>
                About DSS
              </h4>
              <p className="text-sm text-blue-100">
                Comprehensive decision support system integrating FRA claim data, AI-based asset mapping,
                and socio-economic data for evidence-based policy making.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <i className="ri-database-2-line"></i>
                Data Sources
              </h4>
              <ul className="text-sm text-blue-100 space-y-1">
                <li>• FRA Patta Records (IFR, CR, CFR)</li>
                <li>• Satellite Imagery & Land Use</li>
                <li>• Scheme Coverage Data</li>
                <li>• Vulnerability Indices</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <i className="ri-shield-check-line"></i>
                Key Features
              </h4>
              <ul className="text-sm text-blue-100 space-y-1">
                <li>• Spatial analytics & heatmaps</li>
                <li>• ML-based village clustering</li>
                <li>• Eligibility gap analysis</li>
                <li>• Policy scenario simulation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
