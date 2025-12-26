'use client';

import React, { useState, useCallback } from 'react';
import { UserRoleProvider } from './UserRoleProvider';
import AtlasMap from './AtlasMap';
import HierarchicalSearch from './HierarchicalSearch';
import AdvancedFilters from './AdvancedFilters';

import AnalyticsDashboard from './AnalyticsDashboard';
import InterventionReports from './InterventionReports';
import ExportModal from './ExportModal';

import VillagePopup from './VillagePopup';
import PattaHolderPopup from './PattaHolderPopup';
import RoleBasedAccess from './RoleBasedAccess';
import { AtlasFilters, ExportFormat, ExportOptions, AnalyticsData } from '@/types/atlas';
import { exportData } from '@/lib/exportUtils';
import { generateDistrictClaims, calculateAnalytics, ClaimsGeoJSON } from '@/lib/claimsGenerator';

export default function AtlasPage() {
  // State
  const [filters, setFilters] = useState<AtlasFilters>({
    state: '',
    district: '',
    village: '',
    pattaHolderId: '',
    tribalGroup: '',
    claimStatus: 'all',
    dateRange: null,
  });


  const [showReports, setShowReports] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const [isExporting, setIsExporting] = useState(false);



  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  // Lifted State for Claims and Analytics
  const [claimsData, setClaimsData] = useState<ClaimsGeoJSON | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  // Generate claims and analytics when filters change
  React.useEffect(() => {
    if (filters.state && filters.district) {
      // We don't have easy access to district geometry here without fetching it again or moving it up.
      // For now, we'll rely on the centroid fallback in generateDistrictClaims if geometry is missing.
      // Ideally, we'd fetch boundaries here too, but let's stick to the plan of just generating points.
      const data = generateDistrictClaims(filters.state, filters.district);
      setClaimsData(data);
      setAnalyticsData(calculateAnalytics(data));
    } else {
      setClaimsData(null);
      setAnalyticsData(null);
    }
  }, [filters.state, filters.district]);


  // Handlers
  const handleFilterChange = (newFilters: AtlasFilters) => {
    setFilters(newFilters);
  };

  const handleFeatureClick = (feature: any) => {
    setSelectedFeature(feature);
  };

  const handleExport = async (format: ExportFormat, options: ExportOptions) => {
    setIsExporting(true);
    try {
      // In a real app, we would gather the actual data to export
      const mockData = { feature: 'collection', filters };
      await exportData(format, mockData, options);
      setShowExport(false);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <UserRoleProvider>
      <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden flex flex-col">
        {/* Header / Navbar would go here */}

        <div className="flex-1 relative flex">
          {/* Sidebar */}
          <div className="w-80 bg-white shadow-xl z-20 flex flex-col h-full overflow-y-auto border-r border-gray-200">
            <div className="p-4">
              <h1 className="text-xl font-bold text-gray-800 mb-1">FRA Atlas</h1>
              <p className="text-xs text-gray-500 mb-4">Interactive Forest Rights Decision System</p>

              <HierarchicalSearch filters={filters} onFilterChange={handleFilterChange} />

              <div className="my-4"></div>

              <AdvancedFilters filters={filters} onFilterChange={handleFilterChange} />

              <div className="mt-6 space-y-2">
              </div>
            </div>
          </div>

          {/* Main Map Area */}
          <div className="flex-1 relative">
            <AtlasMap
              filters={filters}
              onFeatureClick={handleFeatureClick}
              claimsData={claimsData}
            />





            {/* Popups */}
            {selectedFeature && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                {selectedFeature.properties?.type === 'village' ? (
                  <VillagePopup
                    data={selectedFeature.properties} // Mock mapping
                    onClose={() => setSelectedFeature(null)}
                    onViewDetails={() => alert('View full details')}
                  />
                ) : selectedFeature.properties?.type === 'patta' ? (
                  <PattaHolderPopup
                    data={selectedFeature.properties}
                    onClose={() => setSelectedFeature(null)}
                    onViewDetails={() => alert('View full profile')}
                  />
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Modals / Overlays */}


        {showReports && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <InterventionReports
              reports={[
                {
                  village: 'Rampur',
                  district: 'Ranchi',
                  state: 'Jharkhand',
                  totalBudget: 2500000,
                  totalBeneficiaries: 150,
                  actions: [
                    { scheme: 'JJM', intervention: 'New Tube Well', beneficiaries: 50, budget: 500000, timeline: '3 months' },
                    { scheme: 'MGNREGA', intervention: 'Land Leveling', beneficiaries: 100, budget: 2000000, timeline: '6 months' }
                  ]
                }
              ]}
              onClose={() => setShowReports(false)}
            />
          </div>
        )}

        {showExport && (
          <ExportModal
            onExport={handleExport}
            onClose={() => setShowExport(false)}
            isExporting={isExporting}
          />
        )}
      </div>
    </UserRoleProvider>
  );
}
