// API Service for Atlas Data
export interface ClaimsData {
  id: string;
  state: string;
  district: string;
  village: string;
  tribalGroup: string;
  individualRights: number;
  communityRights: number;
  forestResources: number;
  totalArea: string;
  households: number;
  approvedCount: number;
  pendingCount: number;
  underReviewCount: number;
  rejectedCount: number;
  titleDistributedCount: number;
  approvalRate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClaimsResponse {
  success: boolean;
  data: ClaimsData[];
  summary?: {
    individualRights: number;
    communityRights: number;
    forestResources: number;
    households: number;
    approvedCount: number;
    pendingCount: number;
    underReviewCount: number;
    rejectedCount: number;
    titleDistributedCount: number;
    approvalRate: string;
    totalClaims: number;
  };
  total: number;
  message: string;
  filters?: {
    state: string | null;
    district: string | null;
    village: string | null;
    tribalGroup: string | null;
    claimStatus: string | null;
  };
}

export interface BoundaryData {
  id: string;
  name: string;
  type: 'state' | 'district' | 'village' | 'tribal';
  center: {
    lat: number;
    lng: number;
  };
  bbox: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface BoundaryResponse {
  success: boolean;
  data: {
    type: 'FeatureCollection';
    features: any[];
  };
  boundaries: BoundaryData[];
  total: number;
  message: string;
  filters?: {
    state: string | null;
    district: string | null;
    village: string | null;
    tribalGroup: string | null;
    boundaryType: string;
  };
}

class ApiService {
  private baseUrl = '/api';

  async fetchClaimsData(filters: {
    state?: string;
    district?: string;
    village?: string;
    tribalGroup?: string;
    claimStatus?: string;
  }): Promise<ClaimsResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.state) params.append('state', filters.state);
      if (filters.district) params.append('district', filters.district);
      if (filters.village) params.append('village', filters.village);
      if (filters.tribalGroup) params.append('tribalGroup', filters.tribalGroup);
      if (filters.claimStatus) params.append('claimStatus', filters.claimStatus);

      const response = await fetch(`${this.baseUrl}/claims?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching claims data:', error);
      return {
        success: false,
        data: [],
        total: 0,
        message: 'Failed to fetch claims data. Please try again later.',
        summary: {
          individualRights: 0,
          communityRights: 0,
          forestResources: 0,
          households: 0,
          approvedCount: 0,
          pendingCount: 0,
          underReviewCount: 0,
          rejectedCount: 0,
          titleDistributedCount: 0,
          approvalRate: '0%',
          totalClaims: 0
        }
      };
    }
  }

  async fetchBoundaryData(filters: {
    state?: string;
    district?: string;
    village?: string;
    tribalGroup?: string;
    type?: string;
  }): Promise<BoundaryResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.state) params.append('state', filters.state);
      if (filters.district) params.append('district', filters.district);
      if (filters.village) params.append('village', filters.village);
      if (filters.tribalGroup) params.append('tribalGroup', filters.tribalGroup);
      if (filters.type) params.append('type', filters.type);

      const response = await fetch(`${this.baseUrl}/boundaries?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching boundary data:', error);
      return {
        success: false,
        data: {
          type: 'FeatureCollection',
          features: []
        },
        boundaries: [],
        total: 0,
        message: 'Failed to fetch boundary data. Please try again later.'
      };
    }
  }

  async uploadClaimsData(file: File): Promise<{ success: boolean; message: string; recordsProcessed?: number }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/claims/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading claims data:', error);
      return {
        success: false,
        message: 'Failed to upload claims data. Please try again later.'
      };
    }
  }

  async uploadBoundaryData(boundaryData: {
    state: string;
    district: string;
    village?: string;
    tribalGroup?: string;
    boundaryType: 'state' | 'district' | 'village' | 'tribal';
    geojson: any;
  }): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const response = await fetch(`${this.baseUrl}/boundaries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(boundaryData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading boundary data:', error);
      return {
        success: false,
        message: 'Failed to upload boundary data. Please try again later.'
      };
    }
  }
}

export const apiService = new ApiService();
