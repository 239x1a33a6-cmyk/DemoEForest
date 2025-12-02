// DSS Type Definitions for FRA & Tribal Development

import { GeoJSON } from 'geojson';

// ============================================
// Core Data Types
// ============================================

export interface VillageData {
    id: string;
    name: string;
    state: string;
    district: string;
    block: string;
    geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon;
    center: [number, number]; // [lat, lng]
    pattaStats: PattaStatistics;
    landUse: LandUseData;
    assets: AssetInventory;
    schemeCoverage: SchemeCoverageData;
    vulnerabilityScores: VulnerabilityScores;
    population: PopulationData;
}

export interface PattaStatistics {
    ifrIssued: number;
    ifrPending: number;
    crIssued: number;
    crPending: number;
    cfrIssued: number;
    cfrPending: number;
    totalIssued: number;
    totalPending: number;
}

export interface LandUseData {
    cultivable: number; // in hectares
    forest: number;
    water: number;
    wasteland: number;
    builtUp: number;
    total: number;
}

export interface AssetInventory {
    farmPonds: number;
    checkDams: number;
    irrigationLines: number;
    wells: number;
    waterTanks: number;
    required: AssetType[];
    density: number; // assets per sq km
}

export type AssetType =
    | 'farm-pond'
    | 'check-dam'
    | 'irrigation-line'
    | 'well'
    | 'water-tank'
    | 'community-hall'
    | 'health-center';

export interface SchemeCoverageData {
    pmKisan: number; // number of beneficiaries
    mgnrega: number;
    jjm: number;
    dajgua: number;
    vanDhan: number;
    other: number;
    totalCoverage: number;
    coveragePercentage: number;
}

export interface VulnerabilityScores {
    water: number; // 0-100
    livelihood: number; // 0-100
    ecological: number; // 0-100
    overall: number; // weighted average
    category: VulnerabilityCategory;
}

export type VulnerabilityCategory =
    | 'low'
    | 'medium'
    | 'high'
    | 'critical';

export interface PopulationData {
    total: number;
    households: number;
    tribalPopulation: number;
    tribalHouseholds: number;
    tribalGroups: TribalGroup[];
}

export interface TribalGroup {
    name: string;
    population: number;
    households: number;
    primaryLivelihood: string;
}

// ============================================
// Beneficiary & Eligibility Types
// ============================================

export interface Beneficiary {
    id: string;
    name: string;
    village: string;
    district: string;
    state: string;
    tribalGroup: string;
    pattaId?: string;
    pattaType?: 'IFR' | 'CR' | 'CFR';
    landSize: number; // in hectares
    hasCultivableLand: boolean;
    hasForestLand: boolean;
    hasJobCard: boolean;
    hasPipedWater: boolean;
    hasNTFPAccess: boolean;
    enrolledSchemes: string[];
    eligibleSchemes: string[];
    householdIncome: number;
    familySize: number;
}

export interface EligibilityResult {
    beneficiaryId: string;
    beneficiaryName: string;
    eligibleSchemes: SchemeEligibility[];
    enrollmentGaps: SchemeGap[];
    priorityScore: number;
    recommendations: string[];
}

export interface SchemeEligibility {
    schemeId: string;
    schemeName: string;
    isEligible: boolean;
    isEnrolled: boolean;
    reason: string;
    estimatedBenefit: number;
    applicationSteps: string[];
}

export interface SchemeGap {
    schemeId: string;
    schemeName: string;
    reason: string;
    actionRequired: string;
}

// ============================================
// Scheme Types
// ============================================

export interface Scheme {
    id: string;
    name: string;
    ministry: string;
    category: SchemeCategory;
    benefitType: BenefitType;
    description: string;
    eligibilityCriteria: string[];
    benefits: string[];
    applicationProcess: string[];
    documents: string[];
    budget: number;
    targetBeneficiaries: number;
    currentCoverage: number;
    coveragePercentage: number;
}

export type SchemeCategory =
    | 'livelihood'
    | 'water'
    | 'agriculture'
    | 'forest'
    | 'infrastructure'
    | 'social-welfare';

export type BenefitType =
    | 'cash-transfer'
    | 'asset-creation'
    | 'skill-development'
    | 'infrastructure'
    | 'subsidy';

// ============================================
// Clustering & Recommendation Types
// ============================================

export interface ClusterResult {
    clusterId: string;
    clusterName: string;
    clusterType: ClusterType;
    villages: VillageData[];
    characteristics: ClusterCharacteristics;
    recommendedSchemes: Scheme[];
    priorityScore: number;
    interventionPlan: string[];
}

export type ClusterType =
    | 'water-stressed'
    | 'forest-livelihood'
    | 'agro-potential'
    | 'highly-vulnerable';

export interface ClusterCharacteristics {
    avgWaterVulnerability: number;
    avgLivelihoodVulnerability: number;
    avgEcologicalSensitivity: number;
    totalPopulation: number;
    totalHouseholds: number;
    dominantLivelihood: string;
    keyIssues: string[];
    strengths: string[];
}

// ============================================
// Intervention Planning Types
// ============================================

export interface Intervention {
    id: string;
    type: AssetType;
    location: InterventionLocation;
    suitabilityScore: number;
    estimatedCost: number;
    expectedBeneficiaries: number;
    impactMetrics: ImpactMetrics;
    priority: 'low' | 'medium' | 'high' | 'critical';
    implementationTimeline: string;
    fundingSource: string;
}

export interface InterventionLocation {
    villageId: string;
    villageName: string;
    coordinates: [number, number];
    area: number;
    landUse: string;
    slope: number;
    waterFlowDirection?: string;
    existingAssetDensity: number;
}

export interface ImpactMetrics {
    waterAvailabilityIncrease: number; // percentage
    livelihoodImprovement: number; // percentage
    beneficiaryCount: number;
    costPerBeneficiary: number;
    environmentalImpact: 'positive' | 'neutral' | 'negative';
    sustainabilityScore: number; // 0-100
}

export interface SuitabilityFactors {
    slope: number; // 0-100
    soilType: string;
    waterFlowDirection: string;
    existingAssetDensity: number;
    beneficiaryCount: number;
    landUse: string;
    accessibility: number; // 0-100
    environmentalClearance: boolean;
}

// ============================================
// Policy Simulation Types
// ============================================

export interface PolicyWeights {
    water: number; // 0-1
    livelihood: number; // 0-1
    ecological: number; // 0-1
}

export interface SimulationResult {
    scenarioName: string;
    weights: PolicyWeights;
    villages: VillageSimulationResult[];
    topPriorityVillages: VillageData[];
    impactSummary: SimulationImpact;
    budgetRequirement: number;
}

export interface VillageSimulationResult {
    villageId: string;
    villageName: string;
    originalPriority: number;
    simulatedPriority: number;
    priorityChange: number;
    rankChange: number;
    recommendedInterventions: string[];
}

export interface SimulationImpact {
    totalVillagesAffected: number;
    avgPriorityChange: number;
    topMovers: string[];
    budgetReallocation: BudgetReallocation[];
}

export interface BudgetReallocation {
    category: string;
    originalAllocation: number;
    newAllocation: number;
    change: number;
}

// ============================================
// Report Types
// ============================================

export interface Report {
    id: string;
    type: ReportType;
    title: string;
    generatedAt: Date;
    generatedBy: string;
    filters: ReportFilters;
    data: any;
    format: 'pdf' | 'excel' | 'shapefile';
}

export type ReportType =
    | 'village-intervention-plan'
    | 'beneficiary-eligibility'
    | 'budget-estimate'
    | 'scheme-coverage'
    | 'vulnerability-assessment'
    | 'impact-analysis';

export interface ReportFilters {
    state?: string;
    district?: string;
    block?: string;
    village?: string;
    dateRange?: {
        start: Date;
        end: Date;
    };
    schemeIds?: string[];
    vulnerabilityThreshold?: number;
}

// ============================================
// Map & Spatial Types
// ============================================

export interface MapLayer {
    id: string;
    name: string;
    type: LayerType;
    visible: boolean;
    data: GeoJSON.FeatureCollection;
    style: LayerStyle;
}

export type LayerType =
    | 'ifr-boundary'
    | 'cr-boundary'
    | 'cfr-boundary'
    | 'village-boundary'
    | 'water-body'
    | 'forest-area'
    | 'agricultural-land'
    | 'heatmap';

export interface LayerStyle {
    fillColor: string;
    fillOpacity: number;
    strokeColor: string;
    strokeWidth: number;
    strokeOpacity: number;
}

export interface HeatmapConfig {
    metric: 'water' | 'livelihood' | 'ecological' | 'overall';
    colorScale: string[];
    opacity: number;
    radius: number;
}

export interface MapFilters {
    state: string;
    district: string;
    block: string;
    village: string;
    visibleLayers: string[];
    heatmapMetric: string;
}

// ============================================
// API Response Types
// ============================================

export interface APIResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

// ============================================
// Dashboard KPI Types
// ============================================

export interface DSSMetrics {
    schemeCoverageIncrease: number; // percentage
    waterIndexImprovement: number; // percentage
    livelihoodIndexImprovement: number; // percentage
    pendingClaimsReduction: number; // percentage
    villagesAnalyzed: number;
    interventionsPlanned: number;
    reportsGenerated: number;
    beneficiariesReached: number;
    budgetUtilization: number; // percentage
}
