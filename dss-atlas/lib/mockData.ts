// Mock Data Service for DSS
// This provides realistic sample data for development and testing

import {
    VillageData,
    Beneficiary,
    Scheme,
    ClusterResult,
    Intervention,
    DSSMetrics,
    PattaStatistics,
    LandUseData,
    AssetInventory,
    SchemeCoverageData,
    VulnerabilityScores,
    PopulationData
} from '@/types/dss';

// ============================================
// Village Mock Data
// ============================================

import { expandedMockVillages } from './expandedMockData';

export const mockVillages: VillageData[] = expandedMockVillages;

// ============================================
// Scheme Mock Data
// ============================================

export const mockSchemes: Scheme[] = [
    {
        id: 'SCH001',
        name: 'PM-KISAN',
        ministry: 'Ministry of Agriculture & Farmers Welfare',
        category: 'agriculture',
        benefitType: 'cash-transfer',
        description: 'Direct income support of ₹6000 per year to small and marginal farmers',
        eligibilityCriteria: [
            'Must have cultivable land',
            'Land holding up to 2 hectares',
            'Must be a farmer family',
            'Valid Aadhaar card required'
        ],
        benefits: [
            '₹6000 per year in three installments',
            'Direct bank transfer',
            'No intermediaries'
        ],
        applicationProcess: [
            'Visit PM-KISAN portal or CSC',
            'Fill registration form with land details',
            'Submit Aadhaar and bank account details',
            'Verification by revenue officials',
            'Approval and enrollment'
        ],
        documents: ['Aadhaar Card', 'Bank Account Details', 'Land Records', 'FRA Patta (if applicable)'],
        budget: 75000000000,
        targetBeneficiaries: 120000000,
        currentCoverage: 110000000,
        coveragePercentage: 91.7
    },
    {
        id: 'SCH002',
        name: 'MGNREGA',
        ministry: 'Ministry of Rural Development',
        category: 'livelihood',
        benefitType: 'asset-creation',
        description: 'Guaranteed 100 days of wage employment and creation of durable assets',
        eligibilityCriteria: [
            'Adult member of rural household',
            'Willing to do unskilled manual work',
            'Must have job card',
            'Residence in rural area'
        ],
        benefits: [
            '100 days guaranteed employment',
            'Minimum wage payment',
            'Creation of productive assets',
            'Women empowerment (33% reservation)'
        ],
        applicationProcess: [
            'Apply for job card at Gram Panchayat',
            'Submit application with photo',
            'Receive job card within 15 days',
            'Demand work in writing',
            'Work provided within 15 days'
        ],
        documents: ['Address Proof', 'Passport Size Photo', 'Bank Account Details'],
        budget: 73000000000,
        targetBeneficiaries: 78000000,
        currentCoverage: 56000000,
        coveragePercentage: 71.8
    },
    {
        id: 'SCH003',
        name: 'Jal Jeevan Mission',
        ministry: 'Ministry of Jal Shakti',
        category: 'water',
        benefitType: 'infrastructure',
        description: 'Providing tap water connection to every rural household',
        eligibilityCriteria: [
            'Rural household without piped water',
            'Village included in JJM plan',
            'Community participation in planning'
        ],
        benefits: [
            'Functional tap connection',
            '55 liters per capita per day',
            'Potable water quality',
            'Regular supply'
        ],
        applicationProcess: [
            'Village action plan preparation',
            'Community mobilization',
            'Technical survey',
            'Infrastructure development',
            'Connection provision'
        ],
        documents: ['Household List', 'Village Action Plan', 'Water Quality Test Report'],
        budget: 60000000000,
        targetBeneficiaries: 190000000,
        currentCoverage: 145000000,
        coveragePercentage: 76.3
    },
    {
        id: 'SCH004',
        name: 'DAJGUA (Development of Particularly Vulnerable Tribal Groups)',
        ministry: 'Ministry of Tribal Affairs',
        category: 'forest',
        benefitType: 'skill-development',
        description: 'Comprehensive development of PVTGs and tribal communities',
        eligibilityCriteria: [
            'Belongs to Scheduled Tribe',
            'Engaged in NTFP collection',
            'Living in tribal area',
            'FRA patta holder (preferred)'
        ],
        benefits: [
            'NTFP enterprise support',
            'Value addition training',
            'Market linkage',
            'Infrastructure support'
        ],
        applicationProcess: [
            'Identify through tribal welfare department',
            'Form SHG or cooperative',
            'Submit project proposal',
            'Training and capacity building',
            'Enterprise establishment'
        ],
        documents: ['Tribal Certificate', 'FRA Patta', 'Project Proposal', 'SHG Registration'],
        budget: 5000000000,
        targetBeneficiaries: 3500000,
        currentCoverage: 1200000,
        coveragePercentage: 34.3
    },
    {
        id: 'SCH005',
        name: 'Van Dhan Vikas Kendra',
        ministry: 'Ministry of Tribal Affairs',
        category: 'forest',
        benefitType: 'skill-development',
        description: 'NTFP-based livelihood development through value addition',
        eligibilityCriteria: [
            'Tribal NTFP gatherer',
            'Member of Van Dhan SHG',
            'Access to forest resources',
            'Willing to form cluster'
        ],
        benefits: [
            'Training on value addition',
            'Processing infrastructure',
            'Branding and packaging support',
            'Market access through TRIFED'
        ],
        applicationProcess: [
            'Form Van Dhan SHG (30 members)',
            'Cluster formation (10 SHGs)',
            'Submit proposal to TRIFED',
            'Infrastructure setup',
            'Training and operations'
        ],
        documents: ['Tribal Certificate', 'SHG Registration', 'NTFP Collection Rights', 'Bank Account'],
        budget: 3000000000,
        targetBeneficiaries: 2000000,
        currentCoverage: 800000,
        coveragePercentage: 40.0
    }
];

// ============================================
// Beneficiary Mock Data
// ============================================

export const mockBeneficiaries: Beneficiary[] = [
    {
        id: 'BEN001',
        name: 'Ramesh Koya',
        village: 'Kothagudem',
        district: 'Bhadradri Kothagudem',
        state: 'Telangana',
        tribalGroup: 'Koya',
        pattaId: 'IFR/2023/BKG/001',
        pattaType: 'IFR',
        landSize: 1.5,
        hasCultivableLand: true,
        hasForestLand: true,
        hasJobCard: true,
        hasPipedWater: false,
        hasNTFPAccess: true,
        enrolledSchemes: ['MGNREGA'],
        eligibleSchemes: ['PM-KISAN', 'JJM', 'DAJGUA', 'Van Dhan'],
        householdIncome: 45000,
        familySize: 5
    },
    {
        id: 'BEN002',
        name: 'Lakshmi Lambada',
        village: 'Kothagudem',
        district: 'Bhadradri Kothagudem',
        state: 'Telangana',
        tribalGroup: 'Lambada',
        pattaId: 'IFR/2023/BKG/045',
        pattaType: 'IFR',
        landSize: 0.8,
        hasCultivableLand: true,
        hasForestLand: false,
        hasJobCard: true,
        hasPipedWater: false,
        hasNTFPAccess: false,
        enrolledSchemes: ['PM-KISAN', 'MGNREGA'],
        eligibleSchemes: ['JJM'],
        householdIncome: 38000,
        familySize: 4
    }
];

// ============================================
// Dashboard Metrics
// ============================================

export const mockDSSMetrics: DSSMetrics = {
    schemeCoverageIncrease: 23.5,
    waterIndexImprovement: 18.7,
    livelihoodIndexImprovement: 15.3,
    pendingClaimsReduction: 31.2,
    villagesAnalyzed: 1247,
    interventionsPlanned: 456,
    reportsGenerated: 89,
    beneficiariesReached: 45678,
    budgetUtilization: 67.8
};

// ============================================
// Helper Functions
// ============================================

export function getVillagesByDistrict(district: string): VillageData[] {
    return mockVillages.filter(v => v.district === district);
}

export function getVillagesByState(state: string): VillageData[] {
    return mockVillages.filter(v => v.state === state);
}

export function getVillageById(id: string): VillageData | undefined {
    return mockVillages.find(v => v.id === id);
}

export function getSchemeById(id: string): Scheme | undefined {
    return mockSchemes.find(s => s.id === id);
}

export function getBeneficiaryById(id: string): Beneficiary | undefined {
    return mockBeneficiaries.find(b => b.id === id);
}

export function calculatePriorityScore(
    village: VillageData,
    weights = { water: 0.4, livelihood: 0.3, ecological: 0.3 }
): number {
    return (
        weights.water * village.vulnerabilityScores.water +
        weights.livelihood * village.vulnerabilityScores.livelihood +
        weights.ecological * village.vulnerabilityScores.ecological
    );
}

export function checkEligibility(beneficiary: Beneficiary, schemeId: string): boolean {
    switch (schemeId) {
        case 'SCH001': // PM-KISAN
            return beneficiary.hasCultivableLand &&
                beneficiary.landSize > 0 &&
                !beneficiary.enrolledSchemes.includes('PM-KISAN');

        case 'SCH002': // MGNREGA
            return beneficiary.hasJobCard;

        case 'SCH003': // JJM
            return !beneficiary.hasPipedWater;

        case 'SCH004': // DAJGUA
            return beneficiary.hasNTFPAccess && beneficiary.tribalGroup !== '';

        case 'SCH005': // Van Dhan
            return beneficiary.hasNTFPAccess && beneficiary.tribalGroup !== '';

        default:
            return false;
    }
}

export function getStates(): string[] {
    return Array.from(new Set(mockVillages.map(v => v.state)));
}

export function getDistricts(state?: string): string[] {
    const villages = state ? mockVillages.filter(v => v.state === state) : mockVillages;
    return Array.from(new Set(villages.map(v => v.district)));
}

export function getBlocks(district?: string): string[] {
    const villages = district ? mockVillages.filter(v => v.district === district) : mockVillages;
    return Array.from(new Set(villages.map(v => v.block)));
}

export function getVillageNames(block?: string): string[] {
    const villages = block ? mockVillages.filter(v => v.block === block) : mockVillages;
    return Array.from(new Set(villages.map(v => v.name)));
}
