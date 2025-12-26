// Exact dashboard replication from DashboardModule
'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import FRAAnalyticsDashboard from '../../components/FRAAnalyticsDashboard';

// Dynamically import modules to prevent SSR issues
const FRACoverageProgress = dynamic(() => import('./modules/FRACoverageProgress'), {
  ssr: false,
  loading: () => <div className="animate-pulse h-64 bg-gray-200 rounded-lg"></div>
});

const DataIntegrationStatus = dynamic(() => import('./modules/DataIntegrationStatus'), {
  ssr: false,
  loading: () => <div className="animate-pulse h-64 bg-gray-200 rounded-lg"></div>
});

const AssetMappingInsights = dynamic(() => import('./modules/AssetMappingInsights'), {
  ssr: false,
  loading: () => <div className="animate-pulse h-64 bg-gray-200 rounded-lg"></div>
});

const DSSSchemeLayering = dynamic(() => import('./modules/DSSSchemeLayering'), {
  ssr: false,
  loading: () => <div className="animate-pulse h-64 bg-gray-200 rounded-lg"></div>
});

export default function EnhancedDashboardPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'coverage' | 'integration' | 'assets' | 'schemes'>('overview');

  const tabs = [
    { id: 'overview' as const, label: t('dashboard.tabs.overview'), icon: '📊' },
    { id: 'coverage' as const, label: t('dashboard.tabs.coverage'), icon: '📋' },
    { id: 'integration' as const, label: t('dashboard.tabs.integration'), icon: '🔄' },
    { id: 'assets' as const, label: t('dashboard.tabs.assets'), icon: '🛰️' },
    { id: 'schemes' as const, label: t('dashboard.tabs.schemes'), icon: '🎯' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-green-700 via-emerald-600 to-teal-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-4xl">🇮🇳</span>
                {t('dashboard.title')}
              </h1>
              <p className="text-blue-100 mt-1 text-sm">
                {t('dashboard.realTimeInsights')}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <p className="text-xs text-blue-100">{t('dashboard.lastUpdated')}</p>
                <p className="text-sm font-semibold text-white">{new Date().toLocaleDateString('en-GB')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <FRAAnalyticsDashboard />}
        {activeTab === 'coverage' && <FRACoverageProgress />}
        {activeTab === 'integration' && <DataIntegrationStatus />}
        {activeTab === 'assets' && <AssetMappingInsights />}
        {activeTab === 'schemes' && <DSSSchemeLayering />}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {t('dashboard.footer.copyright')}
            </p>
            <div className="flex items-center gap-4">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                {t('dashboard.footer.exportReport')}
              </button>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                {t('dashboard.footer.downloadData')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
