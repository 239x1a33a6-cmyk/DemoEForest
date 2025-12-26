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
    // --- TELANGANA: Bhadradri Kothagudem ---
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
    },
    {
        id: 'BEN003',
        name: 'Chandra Naik',
        village: 'Burgampahad',
        district: 'Bhadradri Kothagudem',
        state: 'Telangana',
        tribalGroup: 'Lambada',
        pattaId: 'IFR/2023/BKG/067',
        pattaType: 'IFR',
        landSize: 2.1,
        hasCultivableLand: true,
        hasForestLand: true,
        hasJobCard: false,
        hasPipedWater: true,
        hasNTFPAccess: true,
        enrolledSchemes: ['PM-KISAN', 'JJM'],
        eligibleSchemes: ['Van Dhan'],
        householdIncome: 55000,
        familySize: 6
    },

    // --- TELANGANA: Adilabad ---
    {
        id: 'BEN-ADL-01',
        name: 'Bheema Gond',
        village: 'Utnoor',
        district: 'Adilabad',
        state: 'Telangana',
        tribalGroup: 'Gond',
        pattaId: 'IFR/2024/ADL/101',
        pattaType: 'IFR',
        landSize: 3.2,
        hasCultivableLand: true,
        hasForestLand: true,
        hasJobCard: true,
        hasPipedWater: false,
        hasNTFPAccess: true,
        enrolledSchemes: ['MGNREGA', 'PM-KISAN'],
        eligibleSchemes: ['JJM', 'Van Dhan', 'DAJGUA'],
        householdIncome: 48000,
        familySize: 5
    },
    {
        id: 'BEN-ADL-02',
        name: 'Rajeshwari Kolam',
        village: 'Jainoor',
        district: 'Adilabad',
        state: 'Telangana',
        tribalGroup: 'Kolam',
        pattaId: 'IFR/2024/ADL/102',
        pattaType: 'IFR',
        landSize: 1.1,
        hasCultivableLand: true,
        hasForestLand: false,
        hasJobCard: true,
        hasPipedWater: true,
        hasNTFPAccess: false,
        enrolledSchemes: ['MGNREGA', 'JJM'],
        eligibleSchemes: ['PM-KISAN'],
        householdIncome: 32000,
        familySize: 3
    },
    {
        id: 'BEN-ADL-03',
        name: 'Gangaram Thoti',
        village: 'Kerameri',
        district: 'Adilabad',
        state: 'Telangana',
        tribalGroup: 'Thoti',
        pattaId: 'CR/2024/ADL/C05',
        pattaType: 'CR',
        landSize: 5.0,
        hasCultivableLand: false,
        hasForestLand: true,
        hasJobCard: true,
        hasPipedWater: false,
        hasNTFPAccess: true,
        enrolledSchemes: ['MGNREGA'],
        eligibleSchemes: ['Van Dhan', 'JJM'],
        householdIncome: 42000,
        familySize: 7
    },

    // --- TELANGANA: Mulugu ---
    {
        id: 'BEN-MUL-01',
        name: 'Sammakka Koya',
        village: 'Tadvai',
        district: 'Mulugu',
        state: 'Telangana',
        tribalGroup: 'Koya',
        pattaId: 'IFR/2023/MUL/088',
        pattaType: 'IFR',
        landSize: 1.8,
        hasCultivableLand: true,
        hasForestLand: true,
        hasJobCard: true,
        hasPipedWater: false,
        hasNTFPAccess: true,
        enrolledSchemes: ['MGNREGA'],
        eligibleSchemes: ['PM-KISAN', 'JJM', 'Van Dhan'],
        householdIncome: 39000,
        familySize: 4
    },
    {
        id: 'BEN-MUL-02',
        name: 'Venkatesh Nayak',
        village: 'Eturnagaram',
        district: 'Mulugu',
        state: 'Telangana',
        tribalGroup: 'Lambada',
        pattaId: 'IFR/2023/MUL/092',
        pattaType: 'IFR',
        landSize: 2.5,
        hasCultivableLand: true,
        hasForestLand: false,
        hasJobCard: false,
        hasPipedWater: true,
        hasNTFPAccess: false,
        enrolledSchemes: ['PM-KISAN', 'JJM'],
        eligibleSchemes: [],
        householdIncome: 62000,
        familySize: 5
    },
    {
        id: 'BEN-MUL-03',
        name: 'Potharaju Gond',
        village: 'Mangapet',
        district: 'Mulugu',
        state: 'Telangana',
        tribalGroup: 'Gond',
        pattaId: 'CFR/2023/MUL/C12',
        pattaType: 'CFR',
        landSize: 15.0,
        hasCultivableLand: true,
        hasForestLand: true,
        hasJobCard: true,
        hasPipedWater: false,
        hasNTFPAccess: true,
        enrolledSchemes: ['MGNREGA', 'Van Dhan'],
        eligibleSchemes: ['JJM', 'PM-KISAN'],
        householdIncome: 75000,
        familySize: 12
    },

    // --- MADHYA PRADESH: Dindori ---
    {
        id: 'BEN-DIN-01',
        name: 'Birju Baiga',
        village: 'Bajag',
        district: 'Dindori',
        state: 'Madhya Pradesh',
        tribalGroup: 'Baiga',
        pattaId: 'IFR/MP/DIN/004',
        pattaType: 'IFR',
        landSize: 1.2,
        hasCultivableLand: true,
        hasForestLand: true,
        hasJobCard: true,
        hasPipedWater: false,
        hasNTFPAccess: true,
        enrolledSchemes: ['MGNREGA', 'DAJGUA'],
        eligibleSchemes: ['PM-KISAN', 'JJM', 'Van Dhan'],
        householdIncome: 28000,
        familySize: 6
    },
    {
        id: 'BEN-DIN-02',
        name: 'Somvati Gond',
        village: 'Samnapur',
        district: 'Dindori',
        state: 'Madhya Pradesh',
        tribalGroup: 'Gond',
        pattaId: 'IFR/MP/DIN/056',
        pattaType: 'IFR',
        landSize: 2.5,
        hasCultivableLand: true,
        hasForestLand: false,
        hasJobCard: true,
        hasPipedWater: true,
        hasNTFPAccess: true,
        enrolledSchemes: ['PM-KISAN', 'JJM', 'MGNREGA'],
        eligibleSchemes: ['Van Dhan'],
        householdIncome: 45000,
        familySize: 5
    },
    {
        id: 'BEN-DIN-03',
        name: 'Mangal Singh',
        village: 'Amarpur',
        district: 'Dindori',
        state: 'Madhya Pradesh',
        tribalGroup: 'Gond',
        pattaId: 'CR/MP/DIN/022',
        pattaType: 'CR',
        landSize: 0.5,
        hasCultivableLand: true,
        hasForestLand: false,
        hasJobCard: true,
        hasPipedWater: false,
        hasNTFPAccess: false,
        enrolledSchemes: ['MGNREGA'],
        eligibleSchemes: ['PM-KISAN', 'JJM'],
        householdIncome: 24000,
        familySize: 4
    },

    // --- MADHYA PRADESH: Mandla ---
    {
        id: 'BEN-MAN-01',
        name: 'Durga Bai',
        village: 'Bichhiya',
        district: 'Mandla',
        state: 'Madhya Pradesh',
        tribalGroup: 'Gond',
        pattaId: 'IFR/MP/MAN/112',
        pattaType: 'IFR',
        landSize: 1.6,
        hasCultivableLand: true,
        hasForestLand: true,
        hasJobCard: true,
        hasPipedWater: false,
        hasNTFPAccess: true,
        enrolledSchemes: ['MGNREGA', 'Van Dhan'],
        eligibleSchemes: ['PM-KISAN', 'JJM'],
        householdIncome: 36000,
        familySize: 5
    },
    {
        id: 'BEN-MAN-02',
        name: 'Suresh Kol',
        village: 'Nainpur',
        district: 'Mandla',
        state: 'Madhya Pradesh',
        tribalGroup: 'Kol',
        pattaId: 'IFR/MP/MAN/145',
        pattaType: 'IFR',
        landSize: 3.0,
        hasCultivableLand: true,
        hasForestLand: false,
        hasJobCard: false,
        hasPipedWater: true,
        hasNTFPAccess: false,
        enrolledSchemes: ['PM-KISAN', 'JJM'],
        eligibleSchemes: [],
        householdIncome: 58000,
        familySize: 6
    },
    {
        id: 'BEN-MAN-03',
        name: 'Budhram Baiga',
        village: 'Narayanganj',
        district: 'Mandla',
        state: 'Madhya Pradesh',
        tribalGroup: 'Baiga',
        pattaId: 'CFR/MP/MAN/C09',
        pattaType: 'CFR',
        landSize: 25.0,
        hasCultivableLand: false,
        hasForestLand: true,
        hasJobCard: true,
        hasPipedWater: false,
        hasNTFPAccess: true,
        enrolledSchemes: ['MGNREGA', 'DAJGUA'],
        eligibleSchemes: ['JJM', 'Van Dhan'],
        householdIncome: 42000,
        familySize: 15
    },

    // --- MADHYA PRADESH: Balaghat ---
    {
        id: 'BEN-BAL-01',
        name: 'Kamla Pawar',
        village: 'Baihar',
        district: 'Balaghat',
        state: 'Madhya Pradesh',
        tribalGroup: 'Pawar',
        pattaId: 'IFR/MP/BAL/033',
        pattaType: 'IFR',
        landSize: 2.2,
        hasCultivableLand: true,
        hasForestLand: false,
        hasJobCard: true,
        hasPipedWater: true,
        hasNTFPAccess: false,
        enrolledSchemes: ['PM-KISAN', 'JJM', 'MGNREGA'],
        eligibleSchemes: [],
        householdIncome: 52000,
        familySize: 5
    },
    {
        id: 'BEN-BAL-02',
        name: 'Shivlal Baiga',
        village: 'Lanji',
        district: 'Balaghat',
        state: 'Madhya Pradesh',
        tribalGroup: 'Baiga',
        pattaId: 'IFR/MP/BAL/044',
        pattaType: 'IFR',
        landSize: 0.9,
        hasCultivableLand: true,
        hasForestLand: true,
        hasJobCard: true,
        hasPipedWater: false,
        hasNTFPAccess: true,
        enrolledSchemes: ['MGNREGA', 'DAJGUA'],
        eligibleSchemes: ['PM-KISAN', 'JJM', 'Van Dhan'],
        householdIncome: 29000,
        familySize: 4
    },
    {
        id: 'BEN-BAL-03',
        name: 'Rekha Maravi',
        village: 'Katangi',
        district: 'Balaghat',
        state: 'Madhya Pradesh',
        tribalGroup: 'Gond',
        pattaId: 'CR/MP/BAL/012',
        pattaType: 'CR',
        landSize: 4.5,
        hasCultivableLand: true,
        hasForestLand: true,
        hasJobCard: false,
        hasPipedWater: false,
        hasNTFPAccess: true,
        enrolledSchemes: ['PM-KISAN', 'Van Dhan'],
        eligibleSchemes: ['JJM', 'MGNREGA'],
        householdIncome: 48000,
        familySize: 7
    },

    // --- JHARKHAND: West Singhbhum ---
    {
        id: 'BEN-WSB-01',
        name: 'Somay Munda',
        village: 'Chaibasa',
        district: 'West Singhbhum',
        state: 'Jharkhand',
        tribalGroup: 'Munda',
        pattaId: 'IFR/JH/WS/201',
        pattaType: 'IFR',
        landSize: 1.4,
        hasCultivableLand: true,
        hasForestLand: true,
        hasJobCard: true,
        hasPipedWater: false,
        hasNTFPAccess: true,
        enrolledSchemes: ['MGNREGA', 'Van Dhan'],
        eligibleSchemes: ['PM-KISAN', 'JJM'],
        householdIncome: 34000,
        familySize: 6
    },
    {
        id: 'BEN-WSB-02',
        name: 'Birsa Ho',
        village: 'Noamundi',
        district: 'West Singhbhum',
        state: 'Jharkhand',
        tribalGroup: 'Ho',
        pattaId: 'IFR/JH/WS/205',
        pattaType: 'IFR',
        landSize: 2.1,
        hasCultivableLand: true,
        hasForestLand: false,
        hasJobCard: true,
        hasPipedWater: true,
        hasNTFPAccess: false,
        enrolledSchemes: ['PM-KISAN', 'JJM', 'MGNREGA'],
        eligibleSchemes: [],
        householdIncome: 46000,
        familySize: 5
    },
    {
        id: 'BEN-WSB-03',
        name: 'Shanti Oram',
        village: 'Chakradharpur',
        district: 'West Singhbhum',
        state: 'Jharkhand',
        tribalGroup: 'Oraon',
        pattaId: 'CFR/JH/WS/C11',
        pattaType: 'CFR',
        landSize: 12.0,
        hasCultivableLand: false,
        hasForestLand: true,
        hasJobCard: true,
        hasPipedWater: false,
        hasNTFPAccess: true,
        enrolledSchemes: ['MGNREGA'],
        eligibleSchemes: ['JJM', 'Van Dhan', 'DAJGUA'],
        householdIncome: 38000,
        familySize: 8
    },

    // --- JHARKHAND: Ranchi ---
    {
        id: 'BEN-RAN-01',
        name: 'Karma Oraon',
        village: 'Angara',
        district: 'Ranchi',
        state: 'Jharkhand',
        tribalGroup: 'Oraon',
        pattaId: 'IFR/JH/RN/332',
        pattaType: 'IFR',
        landSize: 1.8,
        hasCultivableLand: true,
        hasForestLand: true,
        hasJobCard: true,
        hasPipedWater: true,
        hasNTFPAccess: true,
        enrolledSchemes: ['MGNREGA', 'JJM', 'PM-KISAN'],
        eligibleSchemes: ['Van Dhan'],
        householdIncome: 51000,
        familySize: 5
    },
    {
        id: 'BEN-RAN-02',
        name: 'Sita Munda',
        village: 'Bundu',
        district: 'Ranchi',
        state: 'Jharkhand',
        tribalGroup: 'Munda',
        pattaId: 'IFR/JH/RN/345',
        pattaType: 'IFR',
        landSize: 0.7,
        hasCultivableLand: true,
        hasForestLand: false,
        hasJobCard: true,
        hasPipedWater: false,
        hasNTFPAccess: false,
        enrolledSchemes: ['MGNREGA'],
        eligibleSchemes: ['PM-KISAN', 'JJM'],
        householdIncome: 28000,
        familySize: 4
    },
    {
        id: 'BEN-RAN-03',
        name: 'Rohan Mahto',
        village: 'Tamar',
        district: 'Ranchi',
        state: 'Jharkhand',
        tribalGroup: 'Munda',
        pattaId: 'IFR/JH/RN/356',
        pattaType: 'IFR',
        landSize: 3.5,
        hasCultivableLand: true,
        hasForestLand: false,
        hasJobCard: false,
        hasPipedWater: true,
        hasNTFPAccess: false,
        enrolledSchemes: ['PM-KISAN', 'JJM'],
        eligibleSchemes: [],
        householdIncome: 65000,
        familySize: 6
    },

    // --- JHARKHAND: East Singhbhum ---
    {
        id: 'BEN-ESB-01',
        name: 'Arjun Santhal',
        village: 'Ghatshila',
        district: 'East Singhbhum',
        state: 'Jharkhand',
        tribalGroup: 'Santhal',
        pattaId: 'IFR/JH/ES/401',
        pattaType: 'IFR',
        landSize: 1.3,
        hasCultivableLand: true,
        hasForestLand: true,
        hasJobCard: true,
        hasPipedWater: false,
        hasNTFPAccess: true,
        enrolledSchemes: ['MGNREGA', 'Van Dhan', 'PM-KISAN'],
        eligibleSchemes: ['JJM', 'DAJGUA'],
        householdIncome: 41000,
        familySize: 5
    },
    {
        id: 'BEN-ESB-02',
        name: 'Meena Murmu',
        village: 'Musabani',
        district: 'East Singhbhum',
        state: 'Jharkhand',
        tribalGroup: 'Santhal',
        pattaId: 'IFR/JH/ES/412',
        pattaType: 'IFR',
        landSize: 0.6,
        hasCultivableLand: true,
        hasForestLand: false,
        hasJobCard: true,
        hasPipedWater: true,
        hasNTFPAccess: false,
        enrolledSchemes: ['MGNREGA', 'JJM'],
        eligibleSchemes: ['PM-KISAN'],
        householdIncome: 31000,
        familySize: 4
    },
    {
        id: 'BEN-ESB-03',
        name: 'Gopal Bhumij',
        village: 'Potka',
        district: 'East Singhbhum',
        state: 'Jharkhand',
        tribalGroup: 'Bhumij',
        pattaId: 'CR/JH/ES/425',
        pattaType: 'CR',
        landSize: 2.8,
        hasCultivableLand: true,
        hasForestLand: true,
        hasJobCard: true,
        hasPipedWater: false,
        hasNTFPAccess: true,
        enrolledSchemes: ['MGNREGA', 'PM-KISAN', 'Van Dhan'],
        eligibleSchemes: ['JJM'],
        householdIncome: 49000,
        familySize: 6
    },

    // --- TRIPURA: Dhalai ---
    {
        id: 'BEN-DHL-01',
        name: 'Biplab Debbarma',
        village: 'Ambassa',
        district: 'Dhalai',
        state: 'Tripura',
        tribalGroup: 'Debbarma',
        pattaId: 'IFR/TR/DHL/501',
        pattaType: 'IFR',
        landSize: 1.7,
        hasCultivableLand: true,
        hasForestLand: true,
        hasJobCard: true,
        hasPipedWater: true,
        hasNTFPAccess: true,
        enrolledSchemes: ['MGNREGA', 'JJM', 'Van Dhan'],
        eligibleSchemes: ['PM-KISAN'],
        householdIncome: 44000,
        familySize: 5
    },
    {
        id: 'BEN-DHL-02',
        name: 'Sushma Reang',
        village: 'Gandacherra',
        district: 'Dhalai',
        state: 'Tripura',
        tribalGroup: 'Reang',
        pattaId: 'IFR/TR/DHL/512',
        pattaType: 'IFR',
        landSize: 0.9,
        hasCultivableLand: true,
        hasForestLand: false,
        hasJobCard: true,
        hasPipedWater: false,
        hasNTFPAccess: true,
        enrolledSchemes: ['MGNREGA', 'DAJGUA'],
        eligibleSchemes: ['PM-KISAN', 'JJM', 'Van Dhan'],
        householdIncome: 27000,
        familySize: 4
    },
    {
        id: 'BEN-DHL-03',
        name: 'Manik Tripura',
        village: 'Manu',
        district: 'Dhalai',
        state: 'Tripura',
        tribalGroup: 'Tripuri',
        pattaId: 'CFR/TR/DHL/C77',
        pattaType: 'CFR',
        landSize: 8.5,
        hasCultivableLand: true,
        hasForestLand: true,
        hasJobCard: true,
        hasPipedWater: false,
        hasNTFPAccess: true,
        enrolledSchemes: ['MGNREGA', 'Van Dhan'],
        eligibleSchemes: ['JJM', 'PM-KISAN'],
        householdIncome: 55000,
        familySize: 9
    },

    // --- TRIPURA: South Tripura ---
    {
        id: 'BEN-STP-01',
        name: 'Pradip Jamatia',
        village: 'Belonia',
        district: 'South Tripura',
        state: 'Tripura',
        tribalGroup: 'Jamatia',
        pattaId: 'IFR/TR/STP/601',
        pattaType: 'IFR',
        landSize: 2.0,
        hasCultivableLand: true,
        hasForestLand: true,
        hasJobCard: true,
        hasPipedWater: true,
        hasNTFPAccess: false,
        enrolledSchemes: ['PM-KISAN', 'JJM', 'MGNREGA'],
        eligibleSchemes: ['Van Dhan'],
        householdIncome: 50000,
        familySize: 5
    },
    {
        id: 'BEN-STP-02',
        name: 'Anjali Mog',
        village: 'Sabroom',
        district: 'South Tripura',
        state: 'Tripura',
        tribalGroup: 'Mog',
        pattaId: 'IFR/TR/STP/615',
        pattaType: 'IFR',
        landSize: 1.1,
        hasCultivableLand: true,
        hasForestLand: false,
        hasJobCard: true,
        hasPipedWater: false,
        hasNTFPAccess: true,
        enrolledSchemes: ['MGNREGA', 'Van Dhan'],
        eligibleSchemes: ['PM-KISAN', 'JJM'],
        householdIncome: 33000,
        familySize: 4
    },
    {
        id: 'BEN-STP-03',
        name: 'Ratan Uchai',
        village: 'Rajnagar',
        district: 'South Tripura',
        state: 'Tripura',
        tribalGroup: 'Uchai',
        pattaId: 'IFR/TR/STP/622',
        pattaType: 'IFR',
        landSize: 0.5,
        hasCultivableLand: true,
        hasForestLand: true,
        hasJobCard: true,
        hasPipedWater: false,
        hasNTFPAccess: true,
        enrolledSchemes: ['MGNREGA', 'DAJGUA'],
        eligibleSchemes: ['PM-KISAN', 'JJM', 'Van Dhan'],
        householdIncome: 25000,
        familySize: 3
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
