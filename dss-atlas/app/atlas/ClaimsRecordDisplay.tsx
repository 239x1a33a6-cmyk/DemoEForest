'use client';

import { useState } from 'react';

interface ClaimsRecordDisplayProps {
  filters: {
    state: string;
    district: string;
    village: string;
    tribalGroup: string;
    claimStatus: string;
  };
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

export default function ClaimsRecordDisplay({ filters }: ClaimsRecordDisplayProps) {
  const [selectedClaim, setSelectedClaim] = useState<ClaimRecord | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detailed'>('list');

  // Mock claims data based on filters
  const generateClaimsData = (): ClaimRecord[] => {
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

  const claimsData = generateClaimsData();

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

  if (claimsData.length === 0) {
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
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Claims Records</h2>
            <div className="mt-1">
              <p className="text-sm text-gray-600">
                {filters.village ? `Showing claims for ${filters.village} village` :
                 filters.district ? `Showing claims for ${filters.district} district` :
                 filters.state ? `Showing claims for ${filters.state}` :
                 'All claims records'}
              </p>
              <p className="text-xs text-gray-500">
                {claimsData.length} records found • Click on any record to view details
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="ri-list-check mr-1"></i>
                List View
              </button>
              <button
                onClick={() => setViewMode('detailed')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'detailed' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="ri-layout-grid-line mr-1"></i>
                Detailed View
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {claimsData.filter(c => c.status === 'Approved').length}
            </div>
            <div className="text-xs text-green-700">Approved</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {claimsData.filter(c => c.status === 'Pending').length}
            </div>
            <div className="text-xs text-yellow-700">Pending</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {claimsData.filter(c => c.status === 'Under Review').length}
            </div>
            <div className="text-xs text-blue-700">Under Review</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {claimsData.filter(c => c.status === 'Rejected').length}
            </div>
            <div className="text-xs text-red-700">Rejected</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {claimsData.filter(c => c.status === 'Title Distributed').length}
            </div>
            <div className="text-xs text-purple-700">Title Distributed</div>
          </div>
        </div>
      </div>

      {/* Claims List */}
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {claimsData.map((claim) => (
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
