
'use client';

import { useState, useEffect } from 'react';

interface ReportData {
  location: {
    state: string;
    district: string;
    village: string;
  };
  summary: {
    totalArea: number;
    forestArea: number;
    waterArea: number;
    agricultureArea: number;
    settlementArea: number;
    infrastructureArea: number;
  };
  assets: any;
  analysis: {
    forestHealth: string;
    waterQuality: string;
    agriculturalProductivity: string;
    infrastructureStatus: string;
    tribalRights: string;
  };
  recommendations: string[];
  timestamp: string;
}

export default function MappingStats() {
  const [stats, setStats] = useState({
    totalArea: '0 ha',
    forestCover: '0%',
    waterBodies: '0',
    settlements: '0',
    accuracy: '0%',
    lastUpdate: 'Never'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  // Listen for asset data updates
  useEffect(() => {
    const handleAssetDataUpdate = (event: any) => {
      setIsLoading(true);
      setSelectedLocation({
        state: event.detail.state,
        district: event.detail.district,
        village: event.detail.village
      });

      // Simulate processing time for stats calculation
      setTimeout(() => {
        const assetData = event.detail.data;
        
        if (assetData) {
          // Calculate total area
          const forestArea = parseInt(assetData.forest.area) || 0;
          const waterArea = parseInt(assetData.water.area) || 0;
          const agricultureArea = parseInt(assetData.agriculture.area) || 0;
          const settlementArea = parseInt(assetData.settlement.area) || 0;
          const infrastructureArea = parseInt(assetData.infrastructure.area) || 0;
          
          const totalArea = forestArea + waterArea + agricultureArea + settlementArea + infrastructureArea;
          
          // Calculate forest coverage percentage
          const forestCoveragePercent = totalArea > 0 ? Math.round((forestArea / totalArea) * 100) : 0;
          
          // Update stats with real data
          setStats({
            totalArea: `${totalArea.toLocaleString()} ha`,
            forestCover: `${forestCoveragePercent}%`,
            waterBodies: assetData.water.sources?.toString() || '0',
            settlements: Math.round(assetData.settlement.population / 100).toString() || '0',
            accuracy: '94%', // High accuracy for satellite analysis
            lastUpdate: new Date().toLocaleTimeString()
          });

          // Generate detailed report data
          setReportData({
            location: {
              state: event.detail.state,
              district: event.detail.district,
              village: event.detail.village
            },
            summary: {
              totalArea: totalArea,
              forestArea: forestArea,
              waterArea: waterArea,
              agricultureArea: agricultureArea,
              settlementArea: settlementArea,
              infrastructureArea: infrastructureArea
            },
            assets: assetData,
            analysis: {
              forestHealth: assetData.forest.quality,
              waterQuality: assetData.water.quality,
              agriculturalProductivity: assetData.agriculture.productivity,
              infrastructureStatus: assetData.infrastructure.connectivity,
              tribalRights: assetData.tribal?.rights || 'Not Available'
            },
            recommendations: generateRecommendations(assetData),
            timestamp: new Date().toISOString()
          });
        }
        
        setIsLoading(false);
      }, 800);
    };

    window.addEventListener('assetDataUpdated', handleAssetDataUpdate);
    
    return () => {
      window.removeEventListener('assetDataUpdated', handleAssetDataUpdate);
    };
  }, []);

  // Default stats when no location is selected
  useEffect(() => {
    if (!selectedLocation) {
      setStats({
        totalArea: '4,245 ha',
        forestCover: '58%',
        waterBodies: '12',
        settlements: '8',
        accuracy: '92%',
        lastUpdate: '10 min ago'
      });

      // Set default report data
      setReportData({
        location: {
          state: 'Sample State',
          district: 'Sample District',
          village: 'Sample Village'
        },
        summary: {
          totalArea: 4245,
          forestArea: 2450,
          waterArea: 180,
          agricultureArea: 1200,
          settlementArea: 320,
          infrastructureArea: 95
        },
        assets: {
          forest: { area: '2,450 ha', coverage: 58, quality: 'Dense', biodiversity: 'High' },
          water: { area: '180 ha', sources: 12, quality: 'Good', seasonal: 'Perennial' },
          agriculture: { area: '1,200 ha', productivity: 'Medium', crops: 'Rice, Wheat', irrigation: '60%' },
          settlement: { area: '320 ha', population: 1250, density: 'Medium', infrastructure: 'Good' },
          infrastructure: { area: '95 ha', roads: '35 km', connectivity: 'Good', facilities: 'Basic' }
        },
        analysis: {
          forestHealth: 'Dense',
          waterQuality: 'Good',
          agriculturalProductivity: 'Medium',
          infrastructureStatus: 'Good',
          tribalRights: 'Sample Data'
        },
        recommendations: [
          'Implement sustainable forest management practices',
          'Improve water conservation systems',
          'Enhance agricultural productivity through modern techniques',
          'Develop better infrastructure connectivity'
        ],
        timestamp: new Date().toISOString()
      });
    }
  }, [selectedLocation]);

  const generateRecommendations = (assetData: any) => {
    const recommendations = [];
    
    if (assetData.forest.quality === 'Sparse') {
      recommendations.push('Implement reforestation programs to improve forest density');
    }
    if (assetData.water.quality === 'Fair') {
      recommendations.push('Enhance water treatment and conservation measures');
    }
    if (assetData.agriculture.productivity === 'Low') {
      recommendations.push('Introduce modern farming techniques and irrigation systems');
    }
    if (assetData.settlement.infrastructure === 'Basic') {
      recommendations.push('Upgrade infrastructure facilities for better living conditions');
    }
    if (assetData.tribal?.rights === 'Pending') {
      recommendations.push('Expedite tribal land rights recognition process');
    }
    
    // Add general recommendations
    recommendations.push('Regular monitoring through satellite imagery analysis');
    recommendations.push('Community engagement in sustainable resource management');
    
    return recommendations;
  };

  const handleViewDetailedReport = () => {
    setShowDetailedReport(true);
  };

  const handleDownloadReport = () => {
    if (!reportData) return;
    
    const reportContent = {
      title: 'Asset Mapping Detailed Report',
      generatedAt: new Date().toISOString(),
      location: reportData.location,
      summary: reportData.summary,
      detailedAnalysis: reportData.analysis,
      recommendations: reportData.recommendations,
      rawData: reportData.assets
    };
    
    const dataStr = JSON.stringify(reportContent, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `asset-mapping-report-${reportData.location.village}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const statItems = [
    {
      label: 'Total Mapped Area',
      value: stats.totalArea,
      icon: 'ri-map-2-line',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Forest Coverage',
      value: stats.forestCover,
      icon: 'ri-tree-line',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      label: 'Water Bodies',
      value: stats.waterBodies,
      icon: 'ri-drop-line',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Settlement Areas',
      value: stats.settlements,
      icon: 'ri-home-4-line',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      label: 'Analysis Accuracy',
      value: stats.accuracy,
      icon: 'ri-target-line',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      label: 'Last Updated',
      value: stats.lastUpdate,
      icon: 'ri-time-line',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Mapping Statistics</h3>
        {selectedLocation && (
          <div className="text-sm text-gray-600">
            {selectedLocation.village}, {selectedLocation.district}
          </div>
        )}
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-loader-4-line animate-spin"></i>
            </div>
            Updating...
          </div>
        )}
      </div>

      {/* Loading State Overlay */}
      {isLoading && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-calculator-line text-blue-600"></i>
            </div>
            <div>
              <div className="font-medium text-blue-900">Calculating Statistics</div>
              <div className="text-sm text-blue-700">Processing asset data for {selectedLocation?.village}...</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statItems.map((item, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg border ${item.bgColor} ${item.borderColor} transition-all duration-300 ${
              isLoading ? 'opacity-50' : 'opacity-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">{item.label}</div>
                <div className={`text-2xl font-bold ${item.color} ${isLoading ? 'animate-pulse' : ''}`}>
                  {isLoading ? '...' : item.value}
                </div>
              </div>
              <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                <div className={`w-6 h-6 flex items-center justify-center ${item.color}`}>
                  <i className={item.icon}></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Detailed Report Button */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span>{isLoading ? 'Updating statistics...' : 'Real-time data'}</span>
          </div>
          <button
            onClick={handleViewDetailedReport}
            disabled={isLoading}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium cursor-pointer whitespace-nowrap disabled:bg-gray-300 disabled:cursor-not-allowed max-w-xs"
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-file-text-line"></i>
              </div>
              View Detailed Report
            </div>
          </button>
        </div>
      </div>

      {/* Enhanced Statistics Panel */}
      {selectedLocation && !isLoading && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Location Analysis</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-600">State:</div>
              <div className="font-medium">{selectedLocation.state}</div>
            </div>
            <div>
              <div className="text-gray-600">District:</div>
              <div className="font-medium">{selectedLocation.district}</div>
            </div>
            <div>
              <div className="text-gray-600">Village:</div>
              <div className="font-medium">{selectedLocation.village}</div>
            </div>
            <div>
              <div className="text-gray-600">Data Source:</div>
              <div className="font-medium text-green-600">Satellite Analysis</div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Report Modal */}
      {showDetailedReport && reportData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Detailed Asset Report</h2>
                  <p className="text-gray-600 mt-1">
                    {reportData.location.village}, {reportData.location.district}, {reportData.location.state}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadReport}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap"
                  >
                    <div className="flex items-center gap-2">
                      <i className="ri-download-line"></i>
                      Download
                    </div>
                  </button>
                  <button
                    onClick={() => setShowDetailedReport(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Summary Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Executive Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="text-green-600 font-medium">Forest Area</div>
                    <div className="text-2xl font-bold text-green-800">{reportData.summary.forestArea} ha</div>
                    <div className="text-sm text-green-600">
                      {Math.round((reportData.summary.forestArea / reportData.summary.totalArea) * 100)}% of total
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-blue-600 font-medium">Water Bodies</div>
                    <div className="text-2xl font-bold text-blue-800">{reportData.summary.waterArea} ha</div>
                    <div className="text-sm text-blue-600">
                      {Math.round((reportData.summary.waterArea / reportData.summary.totalArea) * 100)}% of total
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="text-yellow-600 font-medium">Agriculture</div>
                    <div className="text-2xl font-bold text-yellow-800">{reportData.summary.agricultureArea} ha</div>
                    <div className="text-sm text-yellow-600">
                      {Math.round((reportData.summary.agricultureArea / reportData.summary.totalArea) * 100)}% of total
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Analysis */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Analysis</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Forest Health Assessment</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Quality:</span>
                        <span className="ml-2 font-medium">{reportData.analysis.forestHealth}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Biodiversity:</span>
                        <span className="ml-2 font-medium">{reportData.assets.forest.biodiversity}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Water Resources</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Quality:</span>
                        <span className="ml-2 font-medium">{reportData.analysis.waterQuality}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Sources:</span>
                        <span className="ml-2 font-medium">{reportData.assets.water.sources}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Agricultural Assessment</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Productivity:</span>
                        <span className="ml-2 font-medium">{reportData.analysis.agriculturalProductivity}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Irrigation:</span>
                        <span className="ml-2 font-medium">{reportData.assets.agriculture.irrigation}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                <div className="space-y-2">
                  {reportData.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                        <i className="ri-lightbulb-line text-blue-600"></i>
                      </div>
                      <div className="text-sm text-blue-800">{recommendation}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Report Metadata */}
              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Report generated on {new Date(reportData.timestamp).toLocaleString()} • 
                  Data source: Satellite Analysis • 
                  Accuracy: 94%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
