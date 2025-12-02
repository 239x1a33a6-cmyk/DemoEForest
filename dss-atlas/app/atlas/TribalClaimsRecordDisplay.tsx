'use client';

import { useState, useEffect } from 'react';
import { apiService, ClaimsResponse } from './services/apiService';

interface TribalClaimsRecordDisplayProps {
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
    tribalGroup?: string;
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
  tribalArea?: string;
}

export default function TribalClaimsRecordDisplay({ filters, claimsData }: TribalClaimsRecordDisplayProps) {
  const [selectedClaim, setSelectedClaim] = useState<ClaimRecord | null>(null);
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary');
  const [isLoading, setIsLoading] = useState(false);
  const [apiClaimsData, setApiClaimsData] = useState<ClaimRecord[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  // Generate detailed claims records based on filters with tribal-specific data
  const generateDetailedClaims = (): ClaimRecord[] => {
    // If no filters are selected, return empty array
    if (!filters.state && !filters.district && !filters.village) {
      return [];
    }

    const baseClaims: ClaimRecord[] = [
      // Koya tribe claims in Telangana
      {
        id: 'CR001',
        applicantName: 'Lakshmi Bai Koya',
        village: 'Aswapuram',
        district: 'Bhadradri Kothagudem',
        state: 'Telangana',
        tribalGroup: 'Koya',
        claimType: 'Individual Forest Rights',
        landArea: '3.8 hectares',
        status: 'Approved',
        applicationDate: '2019-12-08',
        approvalDate: '2022-01-20',
        coordinates: [[80.5200, 17.2400], [80.5400, 17.2400], [80.5400, 17.2200], [80.5200, 17.2200]],
        supportingDocuments: ['Land Survey Report', 'Tribal Certificate', 'Revenue Records'],
        remarks: 'Traditional forest dweller with documented evidence of forest use for 3 generations',
        tribalArea: 'Koya Tribal Area - Aswapuram'
      },
      {
        id: 'CR002',
        applicantName: 'Kothagudem Koya Collective',
        village: 'Kothagudem',
        district: 'Bhadradri Kothagudem',
        state: 'Telangana',
        tribalGroup: 'Koya',
        claimType: 'Community Forest Rights',
        landArea: '12.5 hectares',
        status: 'Approved',
        applicationDate: '2020-03-15',
        approvalDate: '2022-08-10',
        coordinates: [[80.6100, 17.5500], [80.6300, 17.5500], [80.6300, 17.5300], [80.6100, 17.5300]],
        supportingDocuments: ['Community Resolution', 'Forest Use Certificate', 'Traditional Knowledge Documentation'],
        remarks: 'Community rights for traditional forest management and sustainable use',
        tribalArea: 'Koya Tribal Area - Kothagudem'
      },
      {
        id: 'CR003',
        applicantName: 'Ravi Kumar Koya',
        village: 'Bhadrachalam',
        district: 'Bhadradri Kothagudem',
        state: 'Telangana',
        tribalGroup: 'Koya',
        claimType: 'Community Forest Resources',
        landArea: '8.7 hectares',
        status: 'Pending',
        applicationDate: '2023-01-15',
        coordinates: [[80.8800, 17.6700], [80.9000, 17.6700], [80.9000, 17.6500], [80.8800, 17.6500]],
        supportingDocuments: ['Community Resolution', 'Forest Resource Use Certificate'],
        remarks: 'Under review by District Level Committee',
        tribalArea: 'Koya Tribal Area - Bhadrachalam'
      },

      // Munda tribe claims in Jharkhand
      {
        id: 'CR004',
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
        coordinates: [[85.1100, 23.3800], [85.1300, 23.3800], [85.1300, 23.3600], [85.1100, 23.3600]],
        supportingDocuments: ['Land Survey Report', 'Tribal Certificate', 'Revenue Records'],
        remarks: 'Traditional forest dweller with documented evidence of forest use for 3 generations',
        tribalArea: 'Munda Tribal Area - Angara'
      },
      {
        id: 'CR005',
        applicantName: 'Anita Munda',
        village: 'Bero',
        district: 'Ranchi',
        state: 'Jharkhand',
        tribalGroup: 'Munda',
        claimType: 'Individual Forest Rights',
        landArea: '1.9 hectares',
        status: 'Approved',
        applicationDate: '2019-09-05',
        approvalDate: '2021-12-20',
        coordinates: [[85.4100, 23.2800], [85.4300, 23.2800], [85.4300, 23.2600], [85.4100, 23.2600]],
        supportingDocuments: ['Land Survey Report', 'Tribal Certificate', 'Witness Affidavits'],
        remarks: 'Approved based on traditional forest use and community verification',
        tribalArea: 'Munda Tribal Area - Bero'
      },

      // Gond tribe claims in Madhya Pradesh
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
        coordinates: [[81.0900, 22.9200], [81.1100, 22.9200], [81.1100, 22.9000], [81.0900, 22.9000]],
        supportingDocuments: ['Land Survey Report', 'Tribal Certificate', 'Revenue Records', 'Title Deed'],
        remarks: 'Title deed distributed and registered with revenue department',
        tribalArea: 'Gond Tribal Area - Amarpur'
      },

      // Santhal tribe claims in Odisha
      {
        id: 'CR007',
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
        coordinates: [[86.7200, 21.9300], [86.7400, 21.9300], [86.7400, 21.9100], [86.7200, 21.9100]],
        supportingDocuments: ['Community Resolution', 'Forest Resource Use Certificate', 'Traditional Knowledge Documentation'],
        remarks: 'Community forest resource rights for sustainable forest management',
        tribalArea: 'Santhal Tribal Area - Baripada'
      },

      // Tripuri tribe claims in Tripura
      {
        id: 'CR008',
        applicantName: 'Tribal Welfare Society Agartala',
        village: 'Agartala',
        district: 'West Tripura',
        state: 'Tripura',
        tribalGroup: 'Tripuri',
        claimType: 'Community Forest Rights',
        landArea: '15.2 hectares',
        status: 'Pending',
        applicationDate: '2023-01-15',
        coordinates: [[91.2800, 23.8300], [91.3000, 23.8300], [91.3000, 23.8100], [91.2800, 23.8100]],
        supportingDocuments: ['Community Resolution', 'Forest Use Certificate'],
        remarks: 'Community rights application under review',
        tribalArea: 'Tripuri Tribal Area - Agartala'
      },

      // Additional claims for all major states
      // Andhra Pradesh claims
      {
        id: 'CR009',
        applicantName: 'Rama Devi Koya',
        village: 'Kurnool',
        district: 'Kurnool',
        state: 'Andhra Pradesh',
        tribalGroup: 'Koya',
        claimType: 'Individual Forest Rights',
        landArea: '2.8 hectares',
        status: 'Approved',
        applicationDate: '2020-03-15',
        approvalDate: '2022-01-20',
        coordinates: [[78.0500, 15.8300], [78.0600, 15.8300], [78.0600, 15.8200], [78.0500, 15.8200]],
        supportingDocuments: ['Land Survey Report', 'Tribal Certificate', 'Revenue Records'],
        remarks: 'Traditional forest dweller with documented evidence of forest use',
        tribalArea: 'Koya Tribal Area - Kurnool'
      },
      {
        id: 'CR010',
        applicantName: 'Suresh Kumar Gond',
        village: 'Visakhapatnam',
        district: 'Visakhapatnam',
        state: 'Andhra Pradesh',
        tribalGroup: 'Gond',
        claimType: 'Community Forest Rights',
        landArea: '8.5 hectares',
        status: 'Pending',
        applicationDate: '2023-01-10',
        coordinates: [[83.2185, 17.6868], [83.2285, 17.6868], [83.2285, 17.6768], [83.2185, 17.6768]],
        supportingDocuments: ['Community Resolution', 'Forest Use Certificate'],
        remarks: 'Community rights application under review',
        tribalArea: 'Gond Tribal Area - Visakhapatnam'
      },

      // Chhattisgarh claims
      {
        id: 'CR011',
        applicantName: 'Lakshmi Bai Gond',
        village: 'Bastar',
        district: 'Bastar',
        state: 'Chhattisgarh',
        tribalGroup: 'Gond',
        claimType: 'Individual Forest Rights',
        landArea: '3.2 hectares',
        status: 'Approved',
        applicationDate: '2019-08-20',
        approvalDate: '2021-12-15',
        coordinates: [[81.8661, 19.0943], [81.8761, 19.0943], [81.8761, 19.0843], [81.8661, 19.0843]],
        supportingDocuments: ['Land Survey Report', 'Tribal Certificate', 'Revenue Records'],
        remarks: 'Traditional forest dweller with documented evidence',
        tribalArea: 'Gond Tribal Area - Bastar'
      },
      {
        id: 'CR012',
        applicantName: 'Tribal Welfare Society Raipur',
        village: 'Raipur',
        district: 'Raipur',
        state: 'Chhattisgarh',
        tribalGroup: 'Mixed',
        claimType: 'Community Forest Resources',
        landArea: '12.3 hectares',
        status: 'Approved',
        applicationDate: '2020-05-10',
        approvalDate: '2022-08-20',
        coordinates: [[81.6296, 21.2514], [81.6396, 21.2514], [81.6396, 21.2414], [81.6296, 21.2414]],
        supportingDocuments: ['Community Resolution', 'Forest Resource Use Certificate'],
        remarks: 'Community forest resource rights for sustainable management',
        tribalArea: 'Mixed Tribal Area - Raipur'
      },

      // Maharashtra claims
      {
        id: 'CR013',
        applicantName: 'Anita Devi Bhil',
        village: 'Nashik',
        district: 'Nashik',
        state: 'Maharashtra',
        tribalGroup: 'Bhil',
        claimType: 'Individual Forest Rights',
        landArea: '2.5 hectares',
        status: 'Approved',
        applicationDate: '2018-12-05',
        approvalDate: '2020-06-15',
        coordinates: [[73.7898, 19.9975], [73.7998, 19.9975], [73.7998, 19.9875], [73.7898, 19.9875]],
        supportingDocuments: ['Land Survey Report', 'Tribal Certificate', 'Revenue Records'],
        remarks: 'Traditional forest dweller with documented evidence',
        tribalArea: 'Bhil Tribal Area - Nashik'
      },
      {
        id: 'CR014',
        applicantName: 'Warli Community Collective',
        village: 'Thane',
        district: 'Thane',
        state: 'Maharashtra',
        tribalGroup: 'Warli',
        claimType: 'Community Forest Rights',
        landArea: '15.7 hectares',
        status: 'Pending',
        applicationDate: '2022-03-20',
        coordinates: [[72.9781, 19.2183], [72.9881, 19.2183], [72.9881, 19.2083], [72.9781, 19.2083]],
        supportingDocuments: ['Community Resolution', 'Forest Use Certificate'],
        remarks: 'Community rights application under review',
        tribalArea: 'Warli Tribal Area - Thane'
      },

      // Gujarat claims
      {
        id: 'CR015',
        applicantName: 'Ramesh Kumar Bhil',
        village: 'Vadodara',
        district: 'Vadodara',
        state: 'Gujarat',
        tribalGroup: 'Bhil',
        claimType: 'Individual Forest Rights',
        landArea: '3.8 hectares',
        status: 'Approved',
        applicationDate: '2019-04-10',
        approvalDate: '2021-09-25',
        coordinates: [[73.1812, 22.3072], [73.1912, 22.3072], [73.1912, 22.2972], [73.1812, 22.2972]],
        supportingDocuments: ['Land Survey Report', 'Tribal Certificate', 'Revenue Records'],
        remarks: 'Traditional forest dweller with documented evidence',
        tribalArea: 'Bhil Tribal Area - Vadodara'
      },

      // Rajasthan claims
      {
        id: 'CR016',
        applicantName: 'Meera Devi Meena',
        village: 'Udaipur',
        district: 'Udaipur',
        state: 'Rajasthan',
        tribalGroup: 'Meena',
        claimType: 'Individual Forest Rights',
        landArea: '2.9 hectares',
        status: 'Approved',
        applicationDate: '2020-01-15',
        approvalDate: '2022-03-10',
        coordinates: [[73.7139, 24.5855], [73.7239, 24.5855], [73.7239, 24.5755], [73.7139, 24.5755]],
        supportingDocuments: ['Land Survey Report', 'Tribal Certificate', 'Revenue Records'],
        remarks: 'Traditional forest dweller with documented evidence',
        tribalArea: 'Meena Tribal Area - Udaipur'
      },

      // West Bengal claims
      {
        id: 'CR017',
        applicantName: 'Sita Devi Santhal',
        village: 'Bankura',
        district: 'Bankura',
        state: 'West Bengal',
        tribalGroup: 'Santhal',
        claimType: 'Individual Forest Rights',
        landArea: '3.1 hectares',
        status: 'Approved',
        applicationDate: '2019-06-20',
        approvalDate: '2021-11-15',
        coordinates: [[87.3256, 23.2325], [87.3356, 23.2325], [87.3356, 23.2225], [87.3256, 23.2225]],
        supportingDocuments: ['Land Survey Report', 'Tribal Certificate', 'Revenue Records'],
        remarks: 'Traditional forest dweller with documented evidence',
        tribalArea: 'Santhal Tribal Area - Bankura'
      },

      // Assam claims
      {
        id: 'CR018',
        applicantName: 'Bihu Community Collective',
        village: 'Guwahati',
        district: 'Kamrup',
        state: 'Assam',
        tribalGroup: 'Bodo',
        claimType: 'Community Forest Rights',
        landArea: '10.2 hectares',
        status: 'Pending',
        applicationDate: '2022-08-15',
        coordinates: [[91.7452, 26.1445], [91.7552, 26.1445], [91.7552, 26.1345], [91.7452, 26.1345]],
        supportingDocuments: ['Community Resolution', 'Forest Use Certificate'],
        remarks: 'Community rights application under review',
        tribalArea: 'Bodo Tribal Area - Guwahati'
      },

      // Kerala claims
      {
        id: 'CR019',
        applicantName: 'Kerala Tribal Welfare Society',
        village: 'Wayanad',
        district: 'Wayanad',
        state: 'Kerala',
        tribalGroup: 'Paniya',
        claimType: 'Community Forest Resources',
        landArea: '7.8 hectares',
        status: 'Approved',
        applicationDate: '2020-09-10',
        approvalDate: '2022-12-20',
        coordinates: [[76.0819, 11.6854], [76.0919, 11.6854], [76.0919, 11.6754], [76.0819, 11.6754]],
        supportingDocuments: ['Community Resolution', 'Forest Resource Use Certificate'],
        remarks: 'Community forest resource rights for sustainable management',
        tribalArea: 'Paniya Tribal Area - Wayanad'
      },

      // Karnataka claims
      {
        id: 'CR020',
        applicantName: 'Karnataka Tribal Collective',
        village: 'Mysore',
        district: 'Mysore',
        state: 'Karnataka',
        tribalGroup: 'Soliga',
        claimType: 'Community Forest Rights',
        landArea: '9.5 hectares',
        status: 'Approved',
        applicationDate: '2019-11-25',
        approvalDate: '2021-08-30',
        coordinates: [[76.6394, 12.2958], [76.6494, 12.2958], [76.6494, 12.2858], [76.6394, 12.2858]],
        supportingDocuments: ['Community Resolution', 'Forest Use Certificate'],
        remarks: 'Community rights for traditional forest management',
        tribalArea: 'Soliga Tribal Area - Mysore'
      },

      // Additional states for comprehensive coverage
      // Bihar claims
      {
        id: 'CR021',
        applicantName: 'Bihar Tribal Collective',
        village: 'Patna',
        district: 'Patna',
        state: 'Bihar',
        tribalGroup: 'Santhal',
        claimType: 'Community Forest Rights',
        landArea: '6.4 hectares',
        status: 'Approved',
        applicationDate: '2020-02-15',
        approvalDate: '2022-05-20',
        coordinates: [[85.1376, 25.5941], [85.1476, 25.5941], [85.1476, 25.5841], [85.1376, 25.5841]],
        supportingDocuments: ['Community Resolution', 'Forest Use Certificate'],
        remarks: 'Community rights for traditional forest management',
        tribalArea: 'Santhal Tribal Area - Patna'
      },

      // Tamil Nadu claims
      {
        id: 'CR022',
        applicantName: 'Tamil Nadu Tribal Society',
        village: 'Coimbatore',
        district: 'Coimbatore',
        state: 'Tamil Nadu',
        tribalGroup: 'Irula',
        claimType: 'Individual Forest Rights',
        landArea: '2.7 hectares',
        status: 'Approved',
        applicationDate: '2019-07-10',
        approvalDate: '2021-10-15',
        coordinates: [[76.9558, 11.0168], [76.9658, 11.0168], [76.9658, 11.0068], [76.9558, 11.0068]],
        supportingDocuments: ['Land Survey Report', 'Tribal Certificate', 'Revenue Records'],
        remarks: 'Traditional forest dweller with documented evidence',
        tribalArea: 'Irula Tribal Area - Coimbatore'
      },

      // Uttar Pradesh claims
      {
        id: 'CR023',
        applicantName: 'UP Tribal Welfare Association',
        village: 'Varanasi',
        district: 'Varanasi',
        state: 'Uttar Pradesh',
        tribalGroup: 'Tharu',
        claimType: 'Community Forest Resources',
        landArea: '8.9 hectares',
        status: 'Pending',
        applicationDate: '2022-04-20',
        coordinates: [[82.9739, 25.3176], [82.9839, 25.3176], [82.9839, 25.3076], [82.9739, 25.3076]],
        supportingDocuments: ['Community Resolution', 'Forest Resource Use Certificate'],
        remarks: 'Community forest resource rights application under review',
        tribalArea: 'Tharu Tribal Area - Varanasi'
      },

      // Uttarakhand claims
      {
        id: 'CR024',
        applicantName: 'Uttarakhand Tribal Collective',
        village: 'Dehradun',
        district: 'Dehradun',
        state: 'Uttarakhand',
        tribalGroup: 'Jaunsari',
        claimType: 'Individual Forest Rights',
        landArea: '3.5 hectares',
        status: 'Approved',
        applicationDate: '2020-11-30',
        approvalDate: '2022-06-25',
        coordinates: [[78.0322, 30.3165], [78.0422, 30.3165], [78.0422, 30.3065], [78.0322, 30.3065]],
        supportingDocuments: ['Land Survey Report', 'Tribal Certificate', 'Revenue Records'],
        remarks: 'Traditional forest dweller with documented evidence',
        tribalArea: 'Jaunsari Tribal Area - Dehradun'
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

  // Use API data if available, otherwise fallback to generated data
  const detailedClaims = apiClaimsData.length > 0 ? apiClaimsData : generateDetailedClaims();

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

  const getTribalGroupColor = (tribalGroup: string) => {
    switch (tribalGroup.toLowerCase()) {
      case 'koya':
        return 'text-yellow-600 bg-yellow-50';
      case 'munda':
        return 'text-orange-600 bg-orange-50';
      case 'gond':
        return 'text-red-600 bg-red-50';
      case 'santhal':
        return 'text-indigo-600 bg-indigo-50';
      case 'tripuri':
        return 'text-pink-600 bg-pink-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Fetch claims data from API when filters change
  useEffect(() => {
    const fetchClaimsData = async () => {
      if (!filters.state && !filters.district && !filters.village) {
        setApiClaimsData([]);
        setApiError(null);
        return;
      }

      setIsLoading(true);
      setApiError(null);

      try {
        const response = await apiService.fetchClaimsData(filters);
        
        if (response.success && response.data.length > 0) {
          // Convert API data to ClaimRecord format
          const convertedClaims: ClaimRecord[] = response.data.map((record, index) => ({
            id: record.id,
            applicantName: `${record.tribalGroup} Community - ${record.village}`,
            village: record.village,
            district: record.district,
            state: record.state,
            tribalGroup: record.tribalGroup,
            claimType: 'Individual Forest Rights' as const, // Default type
            landArea: record.totalArea,
            status: record.approvedCount > 0 ? 'Approved' as const : 
                   record.pendingCount > 0 ? 'Pending' as const :
                   record.underReviewCount > 0 ? 'Under Review' as const :
                   record.rejectedCount > 0 ? 'Rejected' as const : 'Pending' as const,
            applicationDate: record.createdAt,
            approvalDate: record.updatedAt,
            coordinates: [[80.5200, 17.2400], [80.5400, 17.2400], [80.5400, 17.2200], [80.5200, 17.2200]], // Mock coordinates
            supportingDocuments: ['Land Survey Report', 'Tribal Certificate', 'Revenue Records'],
            remarks: `Claims data for ${record.tribalGroup} tribal group in ${record.village}`,
            tribalArea: `${record.tribalGroup} Tribal Area - ${record.village}`
          }));
          
          setApiClaimsData(convertedClaims);
        } else {
          setApiClaimsData([]);
          if (response.message) {
            setApiError(response.message);
          }
        }
      } catch (error) {
        console.error('Error fetching claims data:', error);
        setApiError('Failed to fetch claims data. Please try again later.');
        setApiClaimsData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClaimsData();
  }, [filters]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <i className="ri-loader-4-line text-2xl text-yellow-600 animate-spin"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Tribal Claims Data...</h3>
          <p className="text-gray-600">Fetching claims records for the selected tribal area</p>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header with Summary Data */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tribal Claims Records</h2>
            <div className="mt-1">
              <p className="text-sm text-gray-600">
                {filters.tribalGroup && filters.village ? 
                  `Showing ${filters.tribalGroup} tribal claims for ${filters.village} village` :
                  filters.village ? `Showing claims for ${filters.village} village` :
                  filters.district ? `Showing claims for ${filters.district} district` :
                  filters.state ? `Showing claims for ${filters.state}` :
                  'All tribal claims records'}
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

        {/* Tribal Group Highlight */}
        {filters.tribalGroup && (
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-group-line text-yellow-600"></i>
              </div>
              <div>
                <div className="font-medium text-yellow-900">Tribal Group: {filters.tribalGroup}</div>
                <div className="text-sm text-yellow-700">
                  Showing claims specific to the {filters.tribalGroup} tribal community
                </div>
              </div>
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
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
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
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTribalGroupColor(claim.tribalGroup)}`}>
                          {claim.tribalGroup}
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
                      
                      {claim.tribalArea && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-yellow-600">
                          <i className="ri-map-2-line"></i>
                          <span>{claim.tribalArea}</span>
                        </div>
                      )}
                      
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
            {/* Tribal Groups Breakdown */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tribal Groups</h3>
              <div className="space-y-3">
                {['Koya', 'Munda', 'Gond', 'Santhal', 'Tripuri'].map(tribalGroup => {
                  const count = detailedClaims.filter(claim => claim.tribalGroup === tribalGroup).length;
                  if (count === 0) return null;
                  return (
                    <div key={tribalGroup} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{tribalGroup}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getTribalGroupColor(tribalGroup).split(' ')[0].replace('text-', 'bg-')}`}
                            style={{ width: `${(count / detailedClaims.length) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

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

            {/* Quick Actions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <i className="ri-download-line text-gray-600"></i>
                    <span className="text-sm">Export Tribal Data</span>
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
                <h2 className="text-xl font-bold text-gray-900">Tribal Claim Details</h2>
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
                        <span className="text-gray-600">Tribal Group:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getTribalGroupColor(selectedClaim.tribalGroup)}`}>
                          {selectedClaim.tribalGroup}
                        </span>
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
                      {selectedClaim.tribalArea && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tribal Area:</span>
                          <span className="font-medium text-yellow-600">{selectedClaim.tribalArea}</span>
                        </div>
                      )}
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
