'use client';

import { useState, useEffect } from 'react';
import { forestRightsData, getStateData, ForestRightsData } from './ForestRightsData';

interface StateDataDisplayProps {
  selectedState: string;
  filters: any;
}

export default function StateDataDisplay({ selectedState, filters }: StateDataDisplayProps) {
  const [stateData, setStateData] = useState<ForestRightsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedState) {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        const data = getStateData(selectedState);
        setStateData(data || null);
        setIsLoading(false);
      }, 500);
    } else {
      setStateData(null);
    }
  }, [selectedState]);

  if (!selectedState) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">State Data</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <i className="ri-map-pin-line text-2xl text-gray-400"></i>
          </div>
          <p className="text-gray-500">Select a state to view forest rights data</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">State Data</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <i className="ri-loader-4-line text-2xl text-blue-600 animate-spin"></i>
          </div>
          <p className="text-gray-500">Loading state data...</p>
        </div>
      </div>
    );
  }

  if (!stateData) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">State Data</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <i className="ri-error-warning-line text-2xl text-red-600"></i>
          </div>
          <p className="text-gray-500">No data available for selected state</p>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-IN');
  };

  const formatArea = (area: number) => {
    if (area === 0) return 'N/A';
    return `${formatNumber(area)} acres`;
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(2)}%`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">{stateData.state}</h3>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Active</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-file-list-line text-blue-600"></i>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Claims</p>
              <p className="text-lg font-bold text-gray-900">{formatNumber(stateData.claimsReceived.total)}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-award-line text-green-600"></i>
            </div>
            <div>
              <p className="text-sm text-gray-600">Titles Distributed</p>
              <p className="text-lg font-bold text-gray-900">{formatNumber(stateData.titlesDistributed.total)}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-landscape-line text-purple-600"></i>
            </div>
            <div>
              <p className="text-sm text-gray-600">Forest Land</p>
              <p className="text-lg font-bold text-gray-900">{formatArea(stateData.forestLandArea.total)}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <i className="ri-percent-line text-orange-600"></i>
            </div>
            <div>
              <p className="text-sm text-gray-600">Approval Rate</p>
              <p className="text-lg font-bold text-gray-900">{formatPercentage(stateData.claimsApprovedPercentage)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Individual</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Community</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <i className="ri-file-list-line text-gray-400 mr-2"></i>
                  <span className="text-sm font-medium text-gray-900">Claims Received</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(stateData.claimsReceived.individual)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(stateData.claimsReceived.community)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{formatNumber(stateData.claimsReceived.total)}</td>
            </tr>
            <tr className="bg-green-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <i className="ri-check-line text-green-600 mr-2"></i>
                  <span className="text-sm font-medium text-gray-900">Claims Approved</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(stateData.claimsApproved.individual)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(stateData.claimsApproved.community)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{formatNumber(stateData.claimsApproved.total)}</td>
            </tr>
            <tr className="bg-red-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <i className="ri-close-line text-red-600 mr-2"></i>
                  <span className="text-sm font-medium text-gray-900">Claims Rejected</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(stateData.claimsRejected.individual)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(stateData.claimsRejected.community)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{formatNumber(stateData.claimsRejected.total)}</td>
            </tr>
            <tr className="bg-blue-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <i className="ri-award-line text-blue-600 mr-2"></i>
                  <span className="text-sm font-medium text-gray-900">Titles Distributed</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(stateData.titlesDistributed.individual)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(stateData.titlesDistributed.community)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{formatNumber(stateData.titlesDistributed.total)}</td>
            </tr>
            <tr className="bg-purple-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <i className="ri-user-line text-purple-600 mr-2"></i>
                  <span className="text-sm font-medium text-gray-900">IFR (Individual Forest Rights)</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(stateData.forestRightsTypes.ifr)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{formatNumber(stateData.forestRightsTypes.ifr)}</td>
            </tr>
            <tr className="bg-indigo-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <i className="ri-group-line text-indigo-600 mr-2"></i>
                  <span className="text-sm font-medium text-gray-900">CFR (Community Forest Rights)</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(stateData.forestRightsTypes.cfr)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{formatNumber(stateData.forestRightsTypes.cfr)}</td>
            </tr>
            <tr className="bg-teal-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <i className="ri-landscape-line text-teal-600 mr-2"></i>
                  <span className="text-sm font-medium text-gray-900">CR (Community Resources)</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(stateData.forestRightsTypes.cr)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{formatNumber(stateData.forestRightsTypes.cr)}</td>
            </tr>
            <tr className="bg-orange-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <i className="ri-landscape-line text-orange-600 mr-2"></i>
                  <span className="text-sm font-medium text-gray-900">Forest Land Area (acres)</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatArea(stateData.forestLandArea.individual)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatArea(stateData.forestLandArea.community)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{formatArea(stateData.forestLandArea.total)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Implementation Status */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Implementation Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-3">Nodal Officer Appointed</h5>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">SDLC</span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${stateData.nodalOfficerAppointed.sdlc ? 'bg-green-100' : 'bg-red-100'}`}>
                  <i className={`text-sm ${stateData.nodalOfficerAppointed.sdlc ? 'ri-check-line text-green-600' : 'ri-close-line text-red-600'}`}></i>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">DLC</span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${stateData.nodalOfficerAppointed.dlc ? 'bg-green-100' : 'bg-red-100'}`}>
                  <i className={`text-sm ${stateData.nodalOfficerAppointed.dlc ? 'ri-check-line text-green-600' : 'ri-close-line text-red-600'}`}></i>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">SLMC</span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${stateData.nodalOfficerAppointed.slmc ? 'bg-green-100' : 'bg-red-100'}`}>
                  <i className={`text-sm ${stateData.nodalOfficerAppointed.slmc ? 'ri-check-line text-green-600' : 'ri-close-line text-red-600'}`}></i>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-3">Committee Formation</h5>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Translation of Act</span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${stateData.committeeFormation.translationActRules ? 'bg-green-100' : 'bg-red-100'}`}>
                  <i className={`text-sm ${stateData.committeeFormation.translationActRules ? 'ri-check-line text-green-600' : 'ri-close-line text-red-600'}`}></i>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Awareness Campaigns</span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${stateData.committeeFormation.awarenessActRules ? 'bg-green-100' : 'bg-red-100'}`}>
                  <i className={`text-sm ${stateData.committeeFormation.awarenessActRules ? 'ri-check-line text-green-600' : 'ri-close-line text-red-600'}`}></i>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Training of Officials</span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${stateData.committeeFormation.trainingOfficials ? 'bg-green-100' : 'bg-red-100'}`}>
                  <i className={`text-sm ${stateData.committeeFormation.trainingOfficials ? 'ri-check-line text-green-600' : 'ri-close-line text-red-600'}`}></i>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Constitution of FRCs</span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${stateData.committeeFormation.constitutionFRCs ? 'bg-green-100' : 'bg-red-100'}`}>
                  <i className={`text-sm ${stateData.committeeFormation.constitutionFRCs ? 'ri-check-line text-green-600' : 'ri-close-line text-red-600'}`}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Progress Indicators</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Claims Disposed</span>
              <span className="text-sm font-bold text-gray-900">{formatPercentage(stateData.claimsDisposedPercentage)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stateData.claimsDisposedPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Claims Approved</span>
              <span className="text-sm font-bold text-gray-900">{formatPercentage(stateData.claimsApprovedPercentage)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stateData.claimsApprovedPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Claims Rejected</span>
              <span className="text-sm font-bold text-gray-900">{formatPercentage(stateData.claimsRejectedPercentage)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stateData.claimsRejectedPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Titles Distributed</span>
              <span className="text-sm font-bold text-gray-900">{formatPercentage(stateData.titlesDistributedPercentage)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stateData.titlesDistributedPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Source */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <i className="ri-information-line"></i>
          <span>Data source: Ministry of Tribal Affairs, Government of India (as of July 31, 2025)</span>
        </div>
      </div>
    </div>
  );
}
