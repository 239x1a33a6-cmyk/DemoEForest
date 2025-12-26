'use client';

import React, { useState, useCallback } from 'react';
import { UserRoleProvider } from './UserRoleProvider';
import AtlasMap from './AtlasMap';
import HierarchicalSearch from './HierarchicalSearch';
import AdvancedFilters from './AdvancedFilters';
import MapToolbar from './MapToolbar';
import AnalyticsDashboard from './AnalyticsDashboard';
import InterventionReports from './InterventionReports';
import ExportModal from './ExportModal';
import MeasurementTool from './MeasurementTool';
import VillagePopup from './VillagePopup';
import PattaHolderPopup from './PattaHolderPopup';
import RoleBasedAccess from './RoleBasedAccess';
import { AtlasFilters, ExportFormat, ExportOptions } from '@/types/atlas';
import { exportData } from '@/lib/exportUtils';

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
    waterVulnerability: 'all',
    showPendingClaims: false,
    showSchemeGaps: false,
  });

  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showMeasurement, setShowMeasurement] = useState(false);
  const [measurementActive, setMeasurementActive] = useState(false);
  const [measurements, setMeasurements] = useState({ distance: 0, area: 0 });
  const [isExporting, setIsExporting] = useState(false);

  const [selectedFeature, setSelectedFeature] = useState<any>(null);


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
      <div className="relative w-full h-screen overflow-hidden flex flex-col">
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
                <button
                  onClick={() => setShowAnalytics(true)}
                  className="w-full py-2 px-4 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                >
                  <i className="ri-bar-chart-box-line"></i> Analytics Dashboard
                </button>

                <RoleBasedAccess allowedRoles={['admin', 'district']}>
                  <button
                    onClick={() => setShowReports(true)}
                    className="w-full py-2 px-4 bg-purple-50 text-purple-700 rounded-lg font-medium hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="ri-file-list-3-line"></i> Intervention Reports
                  </button>
                </RoleBasedAccess>
              </div>
            </div>
          </div>

          {/* Main Map Area */}
          <div className="flex-1 relative">
            <AtlasMap
              filters={filters}
              onFeatureClick={handleFeatureClick}
              measurementActive={measurementActive}
              onMeasurementsUpdate={setMeasurements}
            />

            {/* Map Toolbar */}
            <div className="absolute top-4 right-4 z-10">
              <MapToolbar
                onZoomIn={() => { }} // Connected via Map ref in real impl
                onZoomOut={() => { }}
                onGeolocate={() => { }}
                onMeasure={() => {
                  setMeasurementActive(prev => !prev);
                  setShowMeasurement(prev => !prev);
                }}
                onExport={() => setShowExport(true)}
                onPrint={() => window.print()}
                onShare={() => alert('Share link copied to clipboard!')}
              />
            </div>

            {/* Measurement Tool */}
            <MeasurementTool
              active={showMeasurement}
              onClose={() => {
                setShowMeasurement(false);
                setMeasurementActive(false);
              }}
              measurements={measurements}
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
        {showAnalytics && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <AnalyticsDashboard
              data={{
                overview: { totalClaims: 12500, approvedClaims: 8500, pendingClaims: 3200, rejectedClaims: 800, totalArea: 45000, totalBeneficiaries: 42000 },
                byState: [],

                byType: { ifr: { count: 12000, area: 25000 }, cfr: { count: 400, area: 15000 }, cr: { count: 100, area: 5000 } },
                timeline: [],
                vulnerability: { waterHigh: 120, waterMedium: 300, waterLow: 500, livelihoodHigh: 150, livelihoodMedium: 250, livelihoodLow: 520 },

              }}
              onClose={() => setShowAnalytics(false)}
            />
          </div>
        )}

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
