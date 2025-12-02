
'use client';

import { useState } from 'react';

interface PattaHolder {
  id: string;
  name: string;
  village: string;
  district: string;
  state: string;
  landArea: string;
  claimStatus: 'approved' | 'pending' | 'rejected';
  coordinates: number[][];
  tribalGroup: string;
  applicationDate: string;
  approvalDate?: string;
}

interface PattaHoldersListProps {
  onViewOnMap: (pattaHolder: PattaHolder) => void;
  selectedVillage?: string;
  selectedDistrict?: string;
  selectedState?: string;
}

export default function PattaHoldersList({ onViewOnMap, selectedVillage, selectedDistrict, selectedState }: PattaHoldersListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');

  // Mock data for patta holders with realistic coordinates
  const pattaHolders: PattaHolder[] = [
    {
      id: 'PH001',
      name: 'Ramesh Kumar Munda',
      village: 'Angara',
      district: 'Ranchi',
      state: 'Jharkhand',
      landArea: '2.5 hectares',
      claimStatus: 'approved',
      coordinates: [
        [85.1150, 23.3850],
        [85.1200, 23.3850],
        [85.1200, 23.3800],
        [85.1150, 23.3800],
        [85.1150, 23.3850]
      ],
      tribalGroup: 'Munda',
      applicationDate: '2019-03-15',
      approvalDate: '2021-08-22'
    },
    {
      id: 'PH002',
      name: 'Sunita Devi Oraon',
      village: 'Bero',
      district: 'Ranchi',
      state: 'Jharkhand',
      landArea: '1.8 hectares',
      claimStatus: 'approved',
      coordinates: [
        [85.4150, 23.2850],
        [85.4250, 23.2850],
        [85.4250, 23.2750],
        [85.4150, 23.2750],
        [85.4150, 23.2850]
      ],
      tribalGroup: 'Oraon',
      applicationDate: '2018-11-20',
      approvalDate: '2020-12-10'
    },
    {
      id: 'PH003',
      name: 'Birsa Munda Collective',
      village: 'Bundu',
      district: 'Ranchi',
      state: 'Jharkhand',
      landArea: '15.2 hectares',
      claimStatus: 'approved',
      coordinates: [
        [85.5750, 23.1650],
        [85.5850, 23.1650],
        [85.5850, 23.1550],
        [85.5750, 23.1550],
        [85.5750, 23.1650]
      ],
      tribalGroup: 'Munda',
      applicationDate: '2020-01-10',
      approvalDate: '2022-05-18'
    },
    {
      id: 'PH004',
      name: 'Mangal Singh Ho',
      village: 'Ghatshila',
      district: 'East Singhbhum',
      state: 'Jharkhand',
      landArea: '3.2 hectares',
      claimStatus: 'pending',
      coordinates: [
        [86.4550, 22.5850],
        [86.4650, 22.5850],
        [86.4650, 22.5750],
        [86.4550, 22.5750],
        [86.4550, 22.5850]
      ],
      tribalGroup: 'Ho',
      applicationDate: '2022-09-05'
    },
    {
      id: 'PH005',
      name: 'Kamala Devi Santhal',
      village: 'Baripada',
      district: 'Mayurbhanj',
      state: 'Odisha',
      landArea: '2.1 hectares',
      claimStatus: 'approved',
      coordinates: [
        [86.7300, 21.9337],
        [86.7400, 21.9337],
        [86.7400, 21.9237],
        [86.7300, 21.9237],
        [86.7300, 21.9337]
      ],
      tribalGroup: 'Santhal',
      applicationDate: '2019-07-12',
      approvalDate: '2021-03-28'
    },
    {
      id: 'PH006',
      name: 'Ravi Kumar Gond',
      village: 'Amarpur',
      district: 'Dindori',
      state: 'Madhya Pradesh',
      landArea: '4.5 hectares',
      claimStatus: 'approved',
      coordinates: [
        [81.0950, 22.9250],
        [81.1050, 22.9250],
        [81.1050, 22.9150],
        [81.0950, 22.9150],
        [81.0950, 22.9250]
      ],
      tribalGroup: 'Gond',
      applicationDate: '2018-05-20',
      approvalDate: '2020-09-15'
    },
    {
      id: 'PH007',
      name: 'Tribal Welfare Society',
      village: 'Agartala',
      district: 'West Tripura',
      state: 'Tripura',
      landArea: '8.7 hectares',
      claimStatus: 'pending',
      coordinates: [
        [91.2818, 23.8365],
        [91.2918, 23.8365],
        [91.2918, 23.8265],
        [91.2818, 23.8265],
        [91.2818, 23.8365]
      ],
      tribalGroup: 'Tripuri',
      applicationDate: '2023-01-15'
    },
    {
      id: 'PH008',
      name: 'Lakshmi Bai Koya',
      village: 'Bhadrachalam',
      district: 'Khammam',
      state: 'Telangana',
      landArea: '3.8 hectares',
      claimStatus: 'approved',
      coordinates: [
        [80.8886, 17.6738],
        [80.8986, 17.6738],
        [80.8986, 17.6638],
        [80.8886, 17.6638],
        [80.8886, 17.6738]
      ],
      tribalGroup: 'Koya',
      applicationDate: '2019-12-08',
      approvalDate: '2022-01-20'
    },
    {
      id: 'PH009',
      name: 'Arjun Singh Bhil',
      village: 'Alirajpur',
      district: 'Alirajpur',
      state: 'Madhya Pradesh',
      landArea: '2.9 hectares',
      claimStatus: 'rejected',
      coordinates: [
        [74.3617, 22.3217],
        [74.3717, 22.3217],
        [74.3717, 22.3117],
        [74.3617, 22.3117],
        [74.3617, 22.3217]
      ],
      tribalGroup: 'Bhil',
      applicationDate: '2021-04-10'
    },
    {
      id: 'PH010',
      name: 'Sita Devi Kondh',
      village: 'Rayagada',
      district: 'Rayagada',
      state: 'Odisha',
      landArea: '1.6 hectares',
      claimStatus: 'pending',
      coordinates: [
        [83.4117, 19.1717],
        [83.4217, 19.1717],
        [83.4217, 19.1617],
        [83.4117, 19.1617],
        [83.4117, 19.1717]
      ],
      tribalGroup: 'Kondh',
      applicationDate: '2022-11-25'
    },
    // Additional patta holders for Angara village
    {
      id: 'PH011',
      name: 'Lakshmi Munda',
      village: 'Angara',
      district: 'Ranchi',
      state: 'Jharkhand',
      landArea: '3.2 hectares',
      claimStatus: 'approved',
      coordinates: [
        [85.1250, 23.3750],
        [85.1300, 23.3750],
        [85.1300, 23.3700],
        [85.1250, 23.3700],
        [85.1250, 23.3750]
      ],
      tribalGroup: 'Munda',
      applicationDate: '2018-06-10',
      approvalDate: '2020-03-15'
    },
    {
      id: 'PH012',
      name: 'Suresh Oraon',
      village: 'Angara',
      district: 'Ranchi',
      state: 'Jharkhand',
      landArea: '2.8 hectares',
      claimStatus: 'approved',
      coordinates: [
        [85.1100, 23.3900],
        [85.1150, 23.3900],
        [85.1150, 23.3850],
        [85.1100, 23.3850],
        [85.1100, 23.3900]
      ],
      tribalGroup: 'Oraon',
      applicationDate: '2019-01-20',
      approvalDate: '2021-07-08'
    },
    // Additional patta holders for Bero village
    {
      id: 'PH013',
      name: 'Kamala Ho',
      village: 'Bero',
      district: 'Ranchi',
      state: 'Jharkhand',
      landArea: '2.1 hectares',
      claimStatus: 'pending',
      coordinates: [
        [85.4200, 23.2800],
        [85.4250, 23.2800],
        [85.4250, 23.2750],
        [85.4200, 23.2750],
        [85.4200, 23.2800]
      ],
      tribalGroup: 'Ho',
      applicationDate: '2023-02-14'
    },
    {
      id: 'PH014',
      name: 'Tribal Welfare Society Bero',
      village: 'Bero',
      district: 'Ranchi',
      state: 'Jharkhand',
      landArea: '12.5 hectares',
      claimStatus: 'approved',
      coordinates: [
        [85.4100, 23.2900],
        [85.4200, 23.2900],
        [85.4200, 23.2800],
        [85.4100, 23.2800],
        [85.4100, 23.2900]
      ],
      tribalGroup: 'Mixed',
      applicationDate: '2020-05-30',
      approvalDate: '2022-11-12'
    },
    // Additional patta holders for Bundu village
    {
      id: 'PH015',
      name: 'Anita Munda',
      village: 'Bundu',
      district: 'Ranchi',
      state: 'Jharkhand',
      landArea: '1.9 hectares',
      claimStatus: 'approved',
      coordinates: [
        [85.5800, 23.1600],
        [85.5850, 23.1600],
        [85.5850, 23.1550],
        [85.5800, 23.1550],
        [85.5800, 23.1600]
      ],
      tribalGroup: 'Munda',
      applicationDate: '2019-09-05',
      approvalDate: '2021-12-20'
    },
    {
      id: 'PH016',
      name: 'Rajesh Santhal',
      village: 'Bundu',
      district: 'Ranchi',
      state: 'Jharkhand',
      landArea: '4.3 hectares',
      claimStatus: 'approved',
      coordinates: [
        [85.5700, 23.1700],
        [85.5800, 23.1700],
        [85.5800, 23.1600],
        [85.5700, 23.1600],
        [85.5700, 23.1700]
      ],
      tribalGroup: 'Santhal',
      applicationDate: '2018-12-18',
      approvalDate: '2020-08-25'
    }
  ];

  // Filter patta holders based on search, filters, and village selection
  const filteredPattaHolders = pattaHolders.filter(holder => {
    const matchesSearch = holder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         holder.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         holder.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         holder.tribalGroup.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || holder.claimStatus === statusFilter;
    const matchesState = stateFilter === 'all' || holder.state === stateFilter;
    
    // Village-based filtering
    const matchesVillage = !selectedVillage || holder.village === selectedVillage;
    const matchesDistrict = !selectedDistrict || holder.district === selectedDistrict;
    const matchesSelectedState = !selectedState || holder.state === selectedState;
    
    return matchesSearch && matchesStatus && matchesState && matchesVillage && matchesDistrict && matchesSelectedState;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return 'ri-check-circle-line';
      case 'pending':
        return 'ri-time-line';
      case 'rejected':
        return 'ri-close-circle-line';
      default:
        return 'ri-question-line';
    }
  };

  const handleViewOnMap = (pattaHolder: PattaHolder) => {
    onViewOnMap({
      ...pattaHolder,
      coordinates: pattaHolder.coordinates
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Patta Holders Registry</h2>
            {selectedVillage ? (
              <div className="mt-1">
                <p className="text-sm text-gray-600">
                  Showing patta holders for <span className="font-semibold text-green-600">{selectedVillage}</span> village
                </p>
                <p className="text-xs text-gray-500">
                  {selectedDistrict}, {selectedState} • Click "View on Map" to see cinematic zoom animation to land parcel
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600 mt-1">
                Click "View on Map" to see cinematic zoom animation to land parcel
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>{filteredPattaHolders.length} records found</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-search-line text-gray-400"></i>
            </div>
            <input
              type="text"
              placeholder="Search by name, village, or tribal group..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm pr-8"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm pr-8"
          >
            <option value="all">All States</option>
            <option value="Jharkhand">Jharkhand</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Odisha">Odisha</option>
            <option value="Tripura">Tripura</option>
            <option value="Telangana">Telangana</option>
          </select>
        </div>
      </div>

      {/* Patta Holders List */}
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {filteredPattaHolders.map((holder) => (
          <div key={holder.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {holder.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{holder.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(holder.claimStatus)}`}>
                        <div className="flex items-center gap-1">
                          <i className={getStatusIcon(holder.claimStatus)}></i>
                          {holder.claimStatus.charAt(0).toUpperCase() + holder.claimStatus.slice(1)}
                        </div>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <i className="ri-map-pin-line text-gray-400"></i>
                        <span>{holder.village}, {holder.district}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <i className="ri-government-line text-gray-400"></i>
                        <span>{holder.state}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <i className="ri-landscape-line text-gray-400"></i>
                        <span>{holder.landArea}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <i className="ri-group-line text-gray-400"></i>
                        <span>{holder.tribalGroup}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                      <span>Applied: {new Date(holder.applicationDate).toLocaleDateString('en-US')}</span>
                      {holder.approvalDate && (
                        <span>Approved: {new Date(holder.approvalDate).toLocaleDateString('en-US')}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleViewOnMap(holder)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap font-medium"
                >
                  <div className="flex items-center gap-2">
                    <i className="ri-earth-line"></i>
                    <span>View on Map</span>
                    <i className="ri-external-link-line text-sm"></i>
                  </div>
                </button>
                
                <button className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer">
                  <i className="ri-more-2-line"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPattaHolders.length === 0 && (
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <i className="ri-search-line text-2xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No patta holders found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {pattaHolders.filter(h => h.claimStatus === 'approved').length}
            </div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {pattaHolders.filter(h => h.claimStatus === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {pattaHolders.filter(h => h.claimStatus === 'rejected').length}
            </div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {pattaHolders.reduce((sum, h) => sum + parseFloat(h.landArea.split(' ')[0]), 0).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Total Hectares</div>
          </div>
        </div>
      </div>
    </div>
  );
}