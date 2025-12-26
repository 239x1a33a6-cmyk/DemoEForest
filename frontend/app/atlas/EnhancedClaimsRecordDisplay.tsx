'use client';

import { useState, useEffect } from 'react';

interface EnhancedClaimsRecordDisplayProps {
  filters: {
    state: string;
    district: string;
    village: string;
    tribalGroup: string;
    claimStatus: string;
  };
  claimsData?: {
    individualRights: number;
    communityRights: number;
    forestResources: number;
    totalArea: string;
    households: number;
    approvalRate: string;
    level: string;
    location: string;
  } | null;
}

interface ClaimRecord {
  id: string;
  applicantName: string;
  village: string;
  district: string;
  state: string;
  tribalGroup: string;
  claimType: 'Individual Forest Rights' | 'Community Forest Rights' | 'Community Forest Resources';
  landArea: string;
  status: 'Approved' | 'Pending' | 'Under Review' | 'Rejected' | 'Title Distributed';
  applicationDate: string;
  approvalDate?: string;
  coordinates: number[][];
  supportingDocuments: string[];
  remarks?: string;
}

export default function EnhancedClaimsRecordDisplay({ filters, claimsData }: EnhancedClaimsRecordDisplayProps) {
  const [selectedClaim, setSelectedClaim] = useState<ClaimRecord | null>(null);
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary');
  const [isLoading, setIsLoading] = useState(false);

  // Generate detailed claims records based on filters
  const generateDetailedClaims = (): ClaimRecord[] => {
    if (!filters.state && !filters.district && !filters.village) {
      return [];
    }

    const baseClaims: ClaimRecord[] = [
      {
        id: 'CR001',
        applicantName: 'Ramesh Kumar Munda',
        village: 'Angara',
        district: 'Ranchi',
        state: 'Jharkhand',
        tribalGroup: 'Munda',
        claimType: 'Individual Forest Rights',
        landArea: '2.5 hectares',
        status: 'Approved',
        applicationDate: '2019-03-15',
        approvalDate: '2021-08-22',
        coordinates: [[85.1150, 23.3850], [85.1200, 23.3850], [85.1200, 23.3800], [85.1150, 23.3800]],
        supportingDocuments: ['Land Survey Report', 'Tribal Certificate', 'Revenue Records'],
        remarks: 'Traditional forest dweller with documented evidence of forest use for 3 generations'
      },
      {
        id: 'CR002',
        applicantName: 'Sunita Devi Oraon',
        village: 'Bero',
        district: 'Ranchi',
        state: 'Jharkhand',
        tribalGroup: 'Oraon',
        claimType: 'Individual Forest Rights',
        landArea: '1.8 hectares',
        status: 'Approved',
        applicationDate: '2018-11-20',
        approvalDate: '2020-12-10',
        coordinates: [[85.4150, 23.2850], [85.4250, 23.2850], [85.4250, 23.2750], [85.4150, 23.2750]],
        supportingDocuments: ['Land Survey Report', 'Tribal Certificate', 'Witness Affidavits'],
        remarks: 'Approved based on traditional forest use and community verification'
      },
      {
        id: 'CR003',
        applicantName: 'Birsa Munda Collective',
        village: 'Bundu',
        district: 'Ranchi',
        state: 'Jharkhand',
        tribalGroup: 'Munda',
        claimType: 'Community Forest Rights',
        landArea: '15.2 hectares',
        status: 'Approved',
        applicationDate: '2020-01-10',
        approvalDate: '2022-05-18',
        coordinates: [[85.5750, 23.1650], [85.5850, 23.1650], [85.5850, 23.1550], [85.5750, 23.1550]],
        supportingDocuments: ['Community Resolution', 'Forest Use Certificate', 'Traditional Knowledge Documentation'],
        remarks: 'Community rights for traditional forest management and sustainable use'
      },
      {
        id: 'CR004',
        applicantName: 'Mangal Singh Ho',
        village: 'Ghatshila',
        district: 'East Singhbhum',
        state: 'Jharkhand',
        tribalGroup: 'Ho',
        claimType: 'Individual Forest Rights',
        landArea: '3.2 hectares',
        status: 'Pending',
        applicationDate: '2022-09-05',
        coordinates: [[86.4550, 22.5850], [86.4650, 22.5850], [86.4650, 22.5750], [86.4550, 22.5750]],
        supportingDocuments: ['Land Survey Report', 'Tribal Certificate'],
        remarks: 'Under review by District Level Committee'
      },
      {
        id: 'CR005',
        applicantName: 'Kamala Devi Santhal',
        village: 'Baripada',
        district: 'Mayurbhanj',
        state: 'Odisha',
        tribalGroup: 'Santhal',
        claimType: 'Community Forest Resources',
        landArea: '8.7 hectares',
        status: 'Approved',
        applicationDate: '2019-07-12',
        approvalDate: '2021-03-28',
        coordinates: [[86.7300, 21.9337], [86.7400, 21.9337], [86.7400, 21.9237], [86.7300, 21.9237]],
        supportingDocuments: ['Community Resolution', 'Forest Resource Use Certificate', 'Traditional Knowledge Documentation'],
        remarks: 'Community forest resource rights for sustainable forest management'
      },
      {
        id: 'CR006',
        applicantName: 'Ravi Kumar Gond',
        village: 'Amarpur',
        district: 'Dindori',
        state: 'Madhya Pradesh',
        tribalGroup: 'Gond',
        claimType: 'Individual Forest Rights',
        landArea: '4.5 hectares',
        status: 'Title Distributed',
        applicationDate: '2018-05-20',
        approvalDate: '2020-09-15',
        coordinates: [[81.0950, 22.9250], [81.1050, 22.9250], [81.1050, 22.9150], [81.0950, 22.9150]],
        supportingDocuments: ['Land Survey Report', 'Tribal Certificate', 'Revenue Records', 'Title Deed'],
        remarks: 'Title deed distributed and registered with revenue department'
      },
      // Additional claims for Kothagudem
      {
        id: 'CR007',
        applicantName: 'Lakshmi Bai Koya',
        village: 'Kothagudem',
        district: 'Bhadradri Kothagudem',
        state: 'Telangana',
        tribalGroup: 'Koya',
        claimType: 'Individual Forest Rights',
        landArea: '3.8 hectares',
        status: 'Approved',
        applicationDate: '2019-12-08',
        approvalDate: '2022-01-20',
        coordinates: [[80.8886, 17.6738], [80.8986, 17.6738], [80.8986, 17.6638], [80.8886, 17.6638]],
        supportingDocuments: ['Land Survey Report', 'Tribal Certificate', 'Revenue Records'],
        remarks: 'Traditional forest dweller with documented evidence of forest use'
      },
      {
        id: 'CR008',
        applicantName: 'Kothagudem Tribal Collective',
        village: 'Kothagudem',
        district: 'Bhadradri Kothagudem',
        state: 'Telangana',
        tribalGroup: 'Koya',
        claimType: 'Community Forest Rights',
        landArea: '12.5 hectares',
        status: 'Approved',
        applicationDate: '2020-03-15',
        approvalDate: '2022-08-10',
        coordinates: [[80.8800, 17.6800], [80.8900, 17.6800], [80.8900, 17.6700], [80.8800, 17.6700]],
        supportingDocuments: ['Community Resolution', 'Forest Use Certificate', 'Traditional Knowledge Documentation'],
        remarks: 'Community rights for traditional forest management and sustainable use'
      }
    ];

    // Filter claims based on selected filters
    return baseClaims.filter(claim => {
      const matchesState = !filters.state || claim.state.toLowerCase().includes(filters.state.toLowerCase());
      const matchesDistrict = !filters.district || claim.district === filters.district;
      const matchesVillage = !filters.village || claim.village === filters.village;
      const matchesTribalGroup = !filters.tribalGroup || claim.tribalGroup === filters.tribalGroup;
      const matchesStatus = !filters.claimStatus || claim.status === filters.claimStatus;

      return matchesState && matchesDistrict && matchesVillage && matchesTribalGroup && matchesStatus;
    });
  };

  const detailedClaims = generateDetailedClaims();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Title Distributed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'ri-check-circle-line';
      case 'Pending':
        return 'ri-time-line';
      case 'Under Review':
        return 'ri-eye-line';
      case 'Rejected':
        return 'ri-close-circle-line';
      case 'Title Distributed':
        return 'ri-file-text-line';
      default:
        return 'ri-question-line';
    }
  };

  const getClaimTypeColor = (type: string) => {
    switch (type) {
      case 'Individual Forest Rights':
        return 'text-blue-600 bg-blue-50';
      case 'Community Forest Rights':
        return 'text-green-600 bg-green-50';
      case 'Community Forest Resources':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Show loading state when filters change
  useEffect(() => {
    if (filters.state || filters.district || filters.village) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [filters]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <i className="ri-loader-4-line text-2xl text-blue-600 animate-spin"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Claims Data...</h3>
          <p className="text-gray-600">Fetching claims records for the selected region</p>
        </div>
      </div>
    );
  }

  if (!claimsData && detailedClaims.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <i className="ri-file-list-line text-2xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Claims Records Found</h3>
          <p className="text-gray-600">
            {!filters.state ? 'Please select a state, district, or village to view claims records.' :
             'No claims records found for the selected criteria. Try adjusting your filters.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header with Summary Data */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Claims Records</h2>
            <div className="mt-1">
              <p className="text-sm text-gray-600">
                {filters.village ? `Showing claims for ${filters.village} village` :
                 filters.district ? `Showing claims for ${filters.district} district` :
                 filters.state ? `Showing claims for ${filters.state}` :
                 'All claims records'}
              </p>
              <p className="text-xs text-gray-500">
                {detailedClaims.length} detailed records found • Click on any record to view details
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('summary')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'summary' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="ri-bar-chart-line mr-1"></i>
                Summary
              </button>
              <button
                onClick={() => setViewMode('detailed')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'detailed' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="ri-list-check mr-1"></i>
                Detailed
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats from Map Data */}
        {claimsData && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-600">{claimsData.individualRights}</div>
              <div className="text-sm text-blue-700 font-medium">Individual Rights</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600">{claimsData.communityRights}</div>
              <div className="text-sm text-green-700 font-medium">Community Rights</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-3xl font-bold text-purple-600">{claimsData.forestResources}</div>
              <div className="text-sm text-purple-700 font-medium">Forest Resources</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-3xl font-bold text-orange-600">{claimsData.totalArea}</div>
              <div className="text-sm text-orange-700 font-medium">Total Area</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="text-3xl font-bold text-indigo-600">{claimsData.approvalRate}</div>
              <div className="text-sm text-indigo-700 font-medium">Approval Rate</div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Claims List */}
      {viewMode === 'detailed' && (
        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {detailedClaims.map((claim) => (
            <div 
              key={claim.id} 
              className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                selectedClaim?.id === claim.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
              onClick={() => setSelectedClaim(claim)}
            >
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {claim.applicantName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{claim.applicantName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(claim.status)}`}>
                          <div className="flex items-center gap-1">
                            <i className={getStatusIcon(claim.status)}></i>
                            {claim.status}
                          </div>
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getClaimTypeColor(claim.claimType)}`}>
                          {claim.claimType}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <i className="ri-map-pin-line text-gray-400"></i>
                          <span>{claim.village}, {claim.district}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <i className="ri-government-line text-gray-400"></i>
                          <span>{claim.state}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <i className="ri-landscape-line text-gray-400"></i>
                          <span>{claim.landArea}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <i className="ri-group-line text-gray-400"></i>
                          <span>{claim.tribalGroup}</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                        <span>Applied: {new Date(claim.applicationDate).toLocaleDateString('en-US')}</span>
                        {claim.approvalDate && (
                          <span>Approved: {new Date(claim.approvalDate).toLocaleDateString('en-US')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer">
                    <i className="ri-eye-line"></i>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer">
                    <i className="ri-download-line"></i>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer">
                    <i className="ri-more-2-line"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary View */}
      {viewMode === 'summary' && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Status Breakdown */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Approved</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Under Review</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                    </div>
                    <span className="text-sm font-medium">23%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '8%' }}></div>
                    </div>
                    <span className="text-sm font-medium">8%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Rejected</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '4%' }}></div>
                    </div>
                    <span className="text-sm font-medium">4%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resource Overview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Water Bodies</span>
                  <span className="text-sm font-medium">8.5K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Agricultural Land</span>
                  <span className="text-sm font-medium">125K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Forest Cover</span>
                  <span className="text-sm font-medium">450K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Settlements</span>
                  <span className="text-sm font-medium">15K</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <i className="ri-download-line text-gray-600"></i>
                    <span className="text-sm">Export Data</span>
                  </div>
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <i className="ri-share-line text-gray-600"></i>
                    <span className="text-sm">Share Report</span>
                  </div>
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <i className="ri-printer-line text-gray-600"></i>
                    <span className="text-sm">Print Report</span>
                  </div>
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <i className="ri-refresh-line text-gray-600"></i>
                    <span className="text-sm">Refresh Data</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed View Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Claim Details</h2>
                <button
                  onClick={() => setSelectedClaim(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Applicant Name:</span>
                        <span className="font-medium">{selectedClaim.applicantName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Claim Type:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getClaimTypeColor(selectedClaim.claimType)}`}>
                          {selectedClaim.claimType}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedClaim.status)}`}>
                          <div className="flex items-center gap-1">
                            <i className={getStatusIcon(selectedClaim.status)}></i>
                            {selectedClaim.status}
                          </div>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Land Area:</span>
                        <span className="font-medium">{selectedClaim.landArea}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tribal Group:</span>
                        <span className="font-medium">{selectedClaim.tribalGroup}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Location Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Village:</span>
                        <span className="font-medium">{selectedClaim.village}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">District:</span>
                        <span className="font-medium">{selectedClaim.district}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">State:</span>
                        <span className="font-medium">{selectedClaim.state}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline and Documents */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Application Date:</span>
                        <span className="font-medium">{new Date(selectedClaim.applicationDate).toLocaleDateString('en-US')}</span>
                      </div>
                      {selectedClaim.approvalDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Approval Date:</span>
                          <span className="font-medium">{new Date(selectedClaim.approvalDate).toLocaleDateString('en-US')}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Processing Time:</span>
                        <span className="font-medium">
                          {selectedClaim.approvalDate ? 
                            `${Math.ceil((new Date(selectedClaim.approvalDate).getTime() - new Date(selectedClaim.applicationDate).getTime()) / (1000 * 60 * 60 * 24))} days` :
                            'In Progress'
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Supporting Documents</h3>
                    <div className="space-y-2">
                      {selectedClaim.supportingDocuments.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <i className="ri-file-text-line text-gray-500"></i>
                          <span className="text-sm">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedClaim.remarks && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Remarks</h3>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {selectedClaim.remarks}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                  <i className="ri-download-line mr-2"></i>
                  Download Documents
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                  <i className="ri-map-pin-line mr-2"></i>
                  View on Map
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <i className="ri-share-line mr-2"></i>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
