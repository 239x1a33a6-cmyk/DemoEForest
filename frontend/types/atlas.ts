// Type definitions for FRA Atlas

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface BoundingBox {
    north: number;
    south: number;
    east: number;
    west: number;
}

// Layer Types
export type LayerType = 'ifr' | 'cr' | 'cfr' | 'village' | 'district' | 'state' | 'tribal' | 'asset' | 'landuse';

export interface Layer {
    id: string;
    name: string;
    type: LayerType;
    visible: boolean;
    opacity: number;
    color: string;
    icon?: string;
    zIndex: number;
}

// GeoJSON Feature Properties
export interface FRAFeatureProperties {
    id: string;
    name: string;
    type: 'IFR' | 'CR' | 'CFR';
    state: string;
    district: string;
    block?: string;
    village: string;
    pattaHolderId?: string;
    pattaHolderName?: string;
    area: number; // in hectares
    claimStatus: 'filed' | 'pending' | 'approved' | 'rejected';
    claimDate?: string;
    approvalDate?: string;
    tribalGroup?: string;
}

export interface VillageFeatureProperties {
    id: string;
    name: string;
    state: string;
    district: string;
    block: string;
    population: number;
    tribalPopulation: number;
    tribalPercentage: number;
    bplPercentage: number;
    totalClaims: number;
    approvedClaims: number;
    pendingClaims: number;
    rejectedClaims: number;
    totalArea: number;
    waterVulnerability: 'low' | 'medium' | 'high';
    livelihoodVulnerability: 'low' | 'medium' | 'high';
}

export interface AssetFeatureProperties {
    id: string;
    name: string;
    type: 'pond' | 'irrigation' | 'road' | 'homestead' | 'school' | 'health' | 'forest';
    village: string;
    district: string;
    state: string;
    condition?: 'good' | 'fair' | 'poor';
    capacity?: number;
    year?: number;
}

// Filter Types
export interface AtlasFilters {
    state: string;
    district: string;
    village: string;
    pattaHolderId: string;
    tribalGroup: string;
    claimStatus: 'all' | 'filed' | 'pending' | 'approved' | 'rejected';
    dateRange: {
        start: string;
        end: string;
    } | null;
}

// Pop-up Data
export interface VillagePopupData {
    village: VillageFeatureProperties;
    claims: {
        filed: number;
        pending: number;
        approved: number;
        rejected: number;
    };
    assets: {
        ponds: number;
        irrigation: number;
        roads: number;
        homesteads: number;
    };
    socioEconomic: {
        population: number;
        tribalPopulation: number;
        bplPercentage: number;
        forestDependentHouseholds: number;
    };
    schemes: {
        eligible: string[];
        applied: string[];
        received: string[];
    };
}

export interface PattaHolderPopupData {
    id: string;
    name: string;
    village: string;
    district: string;
    state: string;
    tribalGroup: string;
    landParcels: {
        id: string;
        area: number;
        type: 'IFR' | 'CR' | 'CFR';
        claimStatus: 'filed' | 'pending' | 'approved' | 'rejected';
        claimDate: string;
        approvalDate?: string;
    }[];
    totalArea: number;
    schemes: {
        eligible: string[];
        applied: string[];
    };
}

// Analytics Data
export interface AnalyticsData {
    overview: {
        totalClaims: number;
        approvedClaims: number;
        pendingClaims: number;
        rejectedClaims: number;
        totalArea: number;
        totalBeneficiaries: number;
    };
    byType: {
        ifr: { count: number; area: number };
        cr: { count: number; area: number };
        cfr: { count: number; area: number };
    };
    byState: {
        state: string;
        claims: number;
        approved: number;
        area: number;
    }[];
    timeline: {
        date: string;
        filed: number;
        approved: number;
        rejected: number;
    }[];
    vulnerability: {
        waterHigh: number;
        waterMedium: number;
        waterLow: number;
        livelihoodHigh: number;
        livelihoodMedium: number;
        livelihoodLow: number;
    };
}

// Scheme Data
export interface SchemeRecommendation {
    id: string;
    name: string;
    type: 'JJM' | 'MGNREGA' | 'PM-KISAN' | 'DAJGUA' | 'OTHER';
    village: string;
    district: string;
    state: string;
    coordinates: Coordinates;
    priority: 'high' | 'medium' | 'low';
    estimatedBudget: number;
    beneficiaries: number;
    description: string;
    eligibilityCriteria: string[];
}

export interface InterventionReport {
    village: string;
    district: string;
    state: string;
    actions: {
        scheme: string;
        intervention: string;
        beneficiaries: number;
        budget: number;
        timeline: string;
    }[];
    totalBudget: number;
    totalBeneficiaries: number;
}

// Export Types
export type ExportFormat = 'png' | 'jpg' | 'pdf' | 'excel' | 'csv' | 'shapefile' | 'geojson';

export interface ExportOptions {
    format: ExportFormat;
    includeFilters: boolean;
    includeLegend: boolean;
    includeMetadata: boolean;
    quality?: number; // for images
    scale?: number; // for PDF
}

// User Roles
export type UserRole = 'admin' | 'district' | 'public';

export interface UserPermissions {
    canEdit: boolean;
    canExport: boolean;
    canViewAnalytics: boolean;
    canManageSchemes: boolean;
    canAccessAllStates: boolean;
    allowedStates?: string[];
    allowedDistricts?: string[];
}

// Map State
export interface MapState {
    center: Coordinates;
    zoom: number;
    bearing: number;
    pitch: number;
    bounds?: BoundingBox;
}

export interface MapStyle {
    id: string;
    name: string;
    url: string;
    thumbnail?: string;
}

// Measurement
export interface Measurement {
    id: string;
    type: 'distance' | 'area';
    coordinates: Coordinates[];
    value: number;
    unit: string;
}

// Land Use Classification
export type LandUseType = 'forest' | 'agriculture' | 'water' | 'settlement' | 'wasteland' | 'other';

export interface LandUseFeature {
    id: string;
    type: LandUseType;
    area: number;
    confidence: number; // AI classification confidence 0-1
    village: string;
    district: string;
    state: string;
}

// FRA Claims from CSV
export type ClaimType = 'IFR' | 'CR' | 'CFR';
export type ClaimStatus = 'Approved' | 'Pending' | 'Rejected' | 'Filed';

export interface ClaimRecord {
    claim_id: string;
    holder_or_community: string;
    claim_type: ClaimType;
    status: ClaimStatus;
    area_acres: number;
    village: string;
    district: string;
    state: string;
    ifrCount?: number;
    cfrCount?: number;
    crCount?: number;
}

export interface ClaimGeoJSONFeature {
    type: 'Feature';
    geometry: {
        type: 'Point';
        coordinates: [number, number];
    };
    properties: ClaimRecord;
}
