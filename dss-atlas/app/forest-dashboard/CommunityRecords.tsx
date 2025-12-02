'use client';

import { useState } from 'react';

export default function CommunityRecords() {
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showRecordDetails, setShowRecordDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const records = [
    {
      id: 1,
      applicationId: 'FRA-2024-001',
      applicantName: 'Ravi Oraon',
      village: 'Khunti Village',
      district: 'Khunti',
      landArea: '2.5 acres',
      applicationType: 'Individual Forest Rights',
      status: 'pending-verification',
      submissionDate: '2024-01-15',
      lastUpdated: '2024-01-20',
      documents: ['Aadhaar Card', 'Tribal Certificate', 'Land Survey', 'Community Letter'],
      gpsCoordinates: '23.3441° N, 85.2677° E',
      surveyorNotes: 'Land under traditional cultivation for 3 generations',
      verificationStage: 'Field Survey Pending'
    },
    {
      id: 2,
      applicationId: 'FRA-2024-002',
      applicantName: 'Sita Munda',
      village: 'Latehar Village',
      district: 'Latehar',
      landArea: '1.8 acres',
      applicationType: 'Individual Forest Rights',
      status: 'approved',
      submissionDate: '2024-01-12',
      lastUpdated: '2024-01-18',
      documents: ['Aadhaar Card', 'Tribal Certificate', 'Land Survey', 'Community Letter', 'Revenue Records'],
      gpsCoordinates: '23.7441° N, 84.8677° E',
      surveyorNotes: 'Clear traditional use evidence, community support verified',
      verificationStage: 'Approved - Title Issued'
    },
    {
      id: 3,
      applicationId: 'FRA-2024-003',
      applicantName: 'Khunti Village Committee',
      village: 'Khunti Village',
      district: 'Khunti',
      landArea: '15.2 acres',
      applicationType: 'Community Forest Rights',
      status: 'under-review',
      submissionDate: '2024-01-10',
      lastUpdated: '2024-01-19',
      documents: ['Village Resolution', 'Community Maps', 'Traditional Use Evidence', 'Revenue Records'],
      gpsCoordinates: '23.3441° N, 85.2677° E',
      surveyorNotes: 'Community forest area with traditional management practices',
      verificationStage: 'Sub-Divisional Committee Review'
    }
  ];

  const filteredRecords = records.filter(record => {
    if (filterStatus === 'all') return true;
    return record.status === filterStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending-verification': return 'bg-yellow-100 text-yellow-800';
      case 'under-review': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewRecord = (record: any) => {
    setSelectedRecord(record);
    setShowRecordDetails(true);
  };

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-check-line text-2xl text-green-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{records.filter(r => r.status === 'approved').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-2xl text-yellow-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{records.filter(r => r.status === 'pending-verification').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-file-search-line text-2xl text-blue-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Under Review</p>
              <p className="text-2xl font-bold text-gray-900">{records.filter(r => r.status === 'under-review').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <i className="ri-file-list-3-line text-2xl text-gray-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{records.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Community FRA Records</h3>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 pr-8"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending-verification">Pending Verification</option>
              <option value="under-review">Under Review</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Land Area
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{record.applicationId}</div>
                      <div className="text-sm text-gray-500">Submitted: {record.submissionDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{record.applicantName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.village}</div>
                    <div className="text-sm text-gray-500">{record.district}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.landArea}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.applicationType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                      {record.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewRecord(record)}
                      className="text-green-600 hover:text-green-900 cursor-pointer mr-4 whitespace-nowrap"
                    >
                      View Details
                    </button>
                    <button className="text-blue-600 hover:text-blue-900 cursor-pointer whitespace-nowrap">
                      Process
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Details Modal */}
      {showRecordDetails && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">FRA Application Details</h3>
                <button
                  onClick={() => setShowRecordDetails(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Application Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Application Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500">Application ID</label>
                      <p className="text-sm font-medium">{selectedRecord.applicationId}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Applicant Name</label>
                      <p className="text-sm font-medium">{selectedRecord.applicantName}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Application Type</label>
                      <p className="text-sm font-medium">{selectedRecord.applicationType}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Current Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRecord.status)}`}>
                        {selectedRecord.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Land Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500">Village</label>
                      <p className="text-sm font-medium">{selectedRecord.village}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">District</label>
                      <p className="text-sm font-medium">{selectedRecord.district}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Land Area</label>
                      <p className="text-sm font-medium">{selectedRecord.landArea}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">GPS Coordinates</label>
                      <p className="text-sm font-medium">{selectedRecord.gpsCoordinates}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Application Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Application Submitted</p>
                      <p className="text-xs text-gray-500">{selectedRecord.submissionDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-xs text-gray-500">{selectedRecord.lastUpdated}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Current Stage</p>
                      <p className="text-xs text-gray-500">{selectedRecord.verificationStage}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Submitted Documents</h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedRecord.documents.map((doc: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded">
                      <i className="ri-file-text-line text-blue-600"></i>
                      <span className="text-sm">{doc}</span>
                      <button className="ml-auto text-green-600 hover:text-green-800 cursor-pointer">
                        <i className="ri-download-line"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Surveyor Notes */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Surveyor Notes</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{selectedRecord.surveyorNotes}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4 border-t border-gray-200">
                <button className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 cursor-pointer whitespace-nowrap">
                  Approve Application
                </button>
                <button className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 cursor-pointer whitespace-nowrap">
                  Reject Application
                </button>
                <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 cursor-pointer whitespace-nowrap">
                  Request More Info
                </button>
                <button className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 cursor-pointer whitespace-nowrap">
                  Schedule Field Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}