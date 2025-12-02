import { VillageData, Scheme, Beneficiary, DSSMetrics } from '@/types/dss';

// ============================================================================
// VILLAGE DATA MATRIX
// ============================================================================

const villageMatrix = [
    // MADHYA PRADESH
    { name: 'Amarpur', state: 'Madhya Pradesh', district: 'Dindori', lat: 22.9200, lng: 81.1000, pattas: 156, tribalPop: 2340, forest: 1450, water: '2 ponds, 1 stream', category: 'high' },
    { name: 'Bajag', state: 'Madhya Pradesh', district: 'Dindori', lat: 22.8800, lng: 81.0600, pattas: 134, tribalPop: 1980, forest: 1230, water: '1 river, streams', category: 'high' },
    { name: 'Karanjia', state: 'Madhya Pradesh', district: 'Dindori', lat: 22.9600, lng: 81.1400, pattas: 189, tribalPop: 2670, forest: 1680, water: '3 ponds, stream', category: 'medium' },
    { name: 'Samnapur', state: 'Madhya Pradesh', district: 'Dindori', lat: 22.9400, lng: 81.1200, pattas: 142, tribalPop: 2120, forest: 1340, water: '2 ponds', category: 'high' },

    { name: 'Bichhiya', state: 'Madhya Pradesh', district: 'Mandla', lat: 22.6200, lng: 80.4000, pattas: 198, tribalPop: 3120, forest: 1890, water: '1 river, 4 ponds', category: 'medium' },
    { name: 'Narayanganj', state: 'Madhya Pradesh', district: 'Mandla', lat: 22.6600, lng: 80.4400, pattas: 167, tribalPop: 2450, forest: 1560, water: '2 streams, 3 ponds', category: 'high' },
    { name: 'Nainpur', state: 'Madhya Pradesh', district: 'Mandla', lat: 22.4300, lng: 80.1100, pattas: 223, tribalPop: 3450, forest: 2100, water: 'River confluence', category: 'low' },
    { name: 'Narayanpur', state: 'Madhya Pradesh', district: 'Mandla', lat: 22.6000, lng: 80.3800, pattas: 145, tribalPop: 2230, forest: 1420, water: 'Seasonal streams', category: 'high' },

    { name: 'Baihar', state: 'Madhya Pradesh', district: 'Balaghat', lat: 22.1000, lng: 80.5500, pattas: 178, tribalPop: 2890, forest: 1670, water: 'Reservoir, 2 ponds', category: 'medium' },
    { name: 'Katangi', state: 'Madhya Pradesh', district: 'Balaghat', lat: 21.7700, lng: 79.8000, pattas: 156, tribalPop: 2340, forest: 1450, water: '3 ponds, stream', category: 'high' },
    { name: 'Waraseoni', state: 'Madhya Pradesh', district: 'Balaghat', lat: 21.7600, lng: 80.0400, pattas: 201, tribalPop: 3230, forest: 1920, water: 'River, ponds', category: 'low' },
    { name: 'Lanji', state: 'Madhya Pradesh', district: 'Balaghat', lat: 21.9800, lng: 80.1200, pattas: 134, tribalPop: 2100, forest: 1280, water: '2 streams', category: 'high' },

    // TELANGANA
    { name: 'Dummugudem', state: 'Telangana', district: 'Bhadradri Kothagudem', lat: 17.5600, lng: 80.5200, pattas: 177, tribalPop: 2456, forest: 1800, water: 'Godavari tributary', category: 'high' },
    { name: 'Bhadrachalam', state: 'Telangana', district: 'Bhadradri Kothagudem', lat: 17.6688, lng: 80.8936, pattas: 245, tribalPop: 3890, forest: 2340, water: 'Godavari river', category: 'medium' },
    { name: 'Burgampahad', state: 'Telangana', district: 'Bhadradri Kothagudem', lat: 17.4200, lng: 80.7800, pattas: 156, tribalPop: 2120, forest: 1560, water: '2 streams', category: 'critical' },
    { name: 'Yellandu', state: 'Telangana', district: 'Bhadradri Kothagudem', lat: 17.5900, lng: 80.3300, pattas: 189, tribalPop: 2780, forest: 1720, water: 'Mine affected', category: 'high' },

    { name: 'Utnoor', state: 'Telangana', district: 'Adilabad', lat: 19.0000, lng: 79.8000, pattas: 234, tribalPop: 3450, forest: 2120, water: '3 ponds, river', category: 'medium' },
    { name: 'Jainoor', state: 'Telangana', district: 'Adilabad', lat: 19.0800, lng: 79.6800, pattas: 198, tribalPop: 2980, forest: 1890, water: 'Seasonal streams', category: 'critical' },
    { name: 'Asifabad', state: 'Telangana', district: 'Adilabad', lat: 19.3500, lng: 79.2833, pattas: 267, tribalPop: 3780, forest: 2450, water: '2 rivers', category: 'low' },
    { name: 'Kerameri', state: 'Telangana', district: 'Adilabad', lat: 19.3800, lng: 79.4600, pattas: 145, tribalPop: 2230, forest: 1420, water: '1 pond, streams', category: 'high' },

    { name: 'Eturnagaram', state: 'Telangana', district: 'Mulugu', lat: 18.3167, lng: 79.9833, pattas: 212, tribalPop: 3120, forest: 2010, water: 'Sanctuary buffer', category: 'medium' },
    { name: 'Mangapet', state: 'Telangana', district: 'Mulugu', lat: 18.4200, lng: 79.8600, pattas: 178, tribalPop: 2670, forest: 1780, water: '2 ponds, stream', category: 'high' },
    { name: 'Venkatapuram', state: 'Telangana', district: 'Mulugu', lat: 18.2400, lng: 80.0800, pattas: 156, tribalPop: 2340, forest: 1560, water: 'River tributary', category: 'high' },
    { name: 'Tadvai', state: 'Telangana', district: 'Mulugu', lat: 18.3600, lng: 79.7800, pattas: 189, tribalPop: 2890, forest: 1850, water: 'Multiple streams', category: 'medium' },

    // TRIPURA
    { name: 'Ambassa', state: 'Tripura', district: 'Dhalai', lat: 23.9300, lng: 91.8500, pattas: 145, tribalPop: 2120, forest: 1340, water: '2 rivers, ponds', category: 'medium' },
    { name: 'Kamalpur', state: 'Tripura', district: 'Dhalai', lat: 24.2000, lng: 91.8300, pattas: 167, tribalPop: 2450, forest: 1520, water: 'River, streams', category: 'high' },
    { name: 'Gandacherra', state: 'Tripura', district: 'Dhalai', lat: 23.7800, lng: 91.9200, pattas: 134, tribalPop: 1980, forest: 1230, water: 'Seasonal streams', category: 'high' },
    { name: 'Manu', state: 'Tripura', district: 'Dhalai', lat: 23.8500, lng: 91.9800, pattas: 156, tribalPop: 2280, forest: 1450, water: 'River valley', category: 'medium' },

    { name: 'Belonia', state: 'Tripura', district: 'South Tripura', lat: 23.2500, lng: 91.4500, pattas: 178, tribalPop: 2670, forest: 1620, water: 'River, 3 ponds', category: 'medium' },
    { name: 'Sabroom', state: 'Tripura', district: 'South Tripura', lat: 23.0000, lng: 91.7000, pattas: 198, tribalPop: 2980, forest: 1780, water: 'River, wetlands', category: 'critical' },
    { name: 'Rupaichhari', state: 'Tripura', district: 'South Tripura', lat: 23.1800, lng: 91.5200, pattas: 156, tribalPop: 2340, forest: 1480, water: 'Hill streams', category: 'high' },
    { name: 'Rajnagar', state: 'Tripura', district: 'South Tripura', lat: 23.3200, lng: 91.3800, pattas: 145, tribalPop: 2120, forest: 1360, water: '2 ponds', category: 'high' },

    // JHARKHAND
    { name: 'Chaibasa', state: 'Jharkhand', district: 'West Singhbhum', lat: 22.5562, lng: 85.8444, pattas: 234, tribalPop: 3450, forest: 2100, water: '2 rivers, reservoir', category: 'medium' },
    { name: 'Chakradharpur', state: 'Jharkhand', district: 'West Singhbhum', lat: 22.6900, lng: 85.6300, pattas: 198, tribalPop: 2890, forest: 1820, water: 'River, ponds', category: 'medium' },
    { name: 'Noamundi', state: 'Jharkhand', district: 'West Singhbhum', lat: 22.1600, lng: 85.5000, pattas: 267, tribalPop: 3670, forest: 2280, water: 'Mining affected', category: 'critical' },
    { name: 'Manjhari', state: 'Jharkhand', district: 'West Singhbhum', lat: 22.7100, lng: 85.4900, pattas: 156, tribalPop: 2340, forest: 1560, water: 'Streams', category: 'high' },

    { name: 'Angara', state: 'Jharkhand', district: 'Ranchi', lat: 23.3800, lng: 85.1200, pattas: 189, tribalPop: 2780, forest: 1720, water: 'River, 3 ponds', category: 'medium' },
    { name: 'Bundu', state: 'Jharkhand', district: 'Ranchi', lat: 23.1600, lng: 85.5800, pattas: 167, tribalPop: 2450, forest: 1580, water: '2 streams', category: 'high' },
    { name: 'Tamar', state: 'Jharkhand', district: 'Ranchi', lat: 23.4600, lng: 85.0800, pattas: 178, tribalPop: 2670, forest: 1650, water: 'River, ponds', category: 'medium' },
    { name: 'Sonahatu', state: 'Jharkhand', district: 'Ranchi', lat: 23.2200, lng: 85.1500, pattas: 145, tribalPop: 2120, forest: 1390, water: 'Seasonal streams', category: 'high' },

    { name: 'Ghatshila', state: 'Jharkhand', district: 'East Singhbhum', lat: 22.5800, lng: 86.4600, pattas: 212, tribalPop: 3120, forest: 1950, water: 'Subarnarekha river', category: 'low' },
    { name: 'Musabani', state: 'Jharkhand', district: 'East Singhbhum', lat: 22.5100, lng: 86.4400, pattas: 198, tribalPop: 2980, forest: 1840, water: 'River, mines', category: 'high' },
    { name: 'Potka', state: 'Jharkhand', district: 'East Singhbhum', lat: 22.6200, lng: 86.3800, pattas: 167, tribalPop: 2450, forest: 1590, water: 'Streams', category: 'medium' },
    { name: 'Baharagora', state: 'Jharkhand', district: 'East Singhbhum', lat: 22.4900, lng: 86.4800, pattas: 178, tribalPop: 2670, forest: 1680, water: 'River confluence', category: 'medium' }
];

// ============================================================================
// GENERATOR FUNCTION
// ============================================================================

function generateVillageData(data: typeof villageMatrix[0]): VillageData {
    const stateCodeMap: Record<string, string> = {
        'Madhya Pradesh': 'MP',
        'Telangana': 'TG',
        'Tripura': 'TR',
        'Jharkhand': 'JH'
    };

    const id = `${stateCodeMap[data.state].toLowerCase()}-${data.district.substring(0, 3).toLowerCase()}-${data.name.substring(0, 3).toLowerCase()}`;

    // Generate pseudo-random but consistent scores based on category
    let baseScore = 50;
    if (data.category === 'critical') baseScore = 80;
    if (data.category === 'high') baseScore = 65;
    if (data.category === 'medium') baseScore = 45;
    if (data.category === 'low') baseScore = 25;

    const waterScore = Math.min(100, Math.max(0, baseScore + (Math.random() * 20 - 10)));
    const livelihoodScore = Math.min(100, Math.max(0, baseScore + (Math.random() * 20 - 10)));
    const ecologicalScore = Math.min(100, Math.max(0, baseScore + (Math.random() * 20 - 10)));
    const overallScore = (waterScore * 0.4) + (livelihoodScore * 0.3) + (ecologicalScore * 0.3);

    return {
        id,
        name: data.name,
        state: data.state,
        district: data.district,
        block: 'Block-' + data.name, // Placeholder
        center: [data.lat, data.lng],
        geometry: {
            type: 'Polygon',
            coordinates: [[
                [data.lng - 0.005, data.lat - 0.005],
                [data.lng + 0.005, data.lat - 0.005],
                [data.lng + 0.005, data.lat + 0.005],
                [data.lng - 0.005, data.lat + 0.005],
                [data.lng - 0.005, data.lat - 0.005]
            ]]
        },
        pattaStats: {
            totalIssued: data.pattas,
            totalPending: Math.floor(data.pattas * 0.2),
            ifrIssued: Math.floor(data.pattas * 0.6),
            ifrPending: Math.floor(data.pattas * 0.1),
            crIssued: Math.floor(data.pattas * 0.3),
            crPending: Math.floor(data.pattas * 0.05),
            cfrIssued: Math.floor(data.pattas * 0.1),
            cfrPending: Math.floor(data.pattas * 0.05)
        },
        landUse: {
            forest: data.forest,
            cultivable: Math.floor(data.forest * 0.3),
            wasteland: Math.floor(data.forest * 0.1),
            water: Math.floor(data.forest * 0.05),
            builtUp: Math.floor(data.forest * 0.02),
            total: Math.floor(data.forest * 1.47)
        },
        assets: {
            farmPonds: Math.floor(Math.random() * 15),
            checkDams: Math.floor(Math.random() * 5),
            irrigationLines: Math.floor(Math.random() * 8),
            wells: Math.floor(Math.random() * 30),
            waterTanks: Math.floor(Math.random() * 3),
            required: ['farm-pond', 'check-dam'],
            density: 0.45
        },
        vulnerabilityScores: {
            water: waterScore,
            livelihood: livelihoodScore,
            ecological: ecologicalScore,
            overall: overallScore,
            category: data.category as any
        },
        population: {
            total: data.tribalPop + Math.floor(data.tribalPop * 0.1),
            tribalPopulation: data.tribalPop,
            households: Math.floor(data.tribalPop / 5),
            tribalHouseholds: Math.floor(data.tribalPop / 5),
            tribalGroups: [
                { name: 'Gond', population: Math.floor(data.tribalPop * 0.6), households: Math.floor(data.tribalPop * 0.6 / 5), primaryLivelihood: 'Agriculture' },
                { name: 'Baiga', population: Math.floor(data.tribalPop * 0.4), households: Math.floor(data.tribalPop * 0.4 / 5), primaryLivelihood: 'NTFP' }
            ]
        },
        schemeCoverage: {
            pmKisan: Math.floor(data.pattas * 0.8),
            mgnrega: Math.floor(data.tribalPop * 0.4),
            jjm: Math.floor(data.tribalPop / 5 * 0.6),
            dajgua: Math.floor(data.tribalPop * 0.1),
            vanDhan: Math.floor(data.tribalPop * 0.05),
            other: Math.floor(data.tribalPop * 0.1),
            totalCoverage: Math.floor(data.tribalPop * 0.8),
            coveragePercentage: 65.5
        }
    };
}

export const expandedMockVillages: VillageData[] = villageMatrix.map(generateVillageData);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getVillagesByState(state: string): VillageData[] {
    return expandedMockVillages.filter(v => v.state === state);
}

export function getVillagesByDistrict(district: string): VillageData[] {
    return expandedMockVillages.filter(v => v.district === district);
}

export function getTopPriorityVillages(count: number = 10): VillageData[] {
    return [...expandedMockVillages]
        .sort((a, b) => b.vulnerabilityScores.overall - a.vulnerabilityScores.overall)
        .slice(0, count);
}

export function getStateStatistics(state: string) {
    const villages = getVillagesByState(state);
    if (villages.length === 0) return null;

    return {
        totalVillages: villages.length,
        totalPopulation: villages.reduce((sum, v) => sum + v.population.total, 0),
        totalTribalPop: villages.reduce((sum, v) => sum + v.population.tribalPopulation, 0),
        totalPattas: villages.reduce((sum, v) => sum + v.pattaStats.totalIssued, 0),
        avgVulnerability: villages.reduce((sum, v) => sum + v.vulnerabilityScores.overall, 0) / villages.length,
        highPriorityCount: villages.filter(v => v.vulnerabilityScores.category === 'high' || v.vulnerabilityScores.category === 'critical').length
    };
}

export function getStates(): string[] {
    return Array.from(new Set(expandedMockVillages.map(v => v.state)));
}

export function getDistricts(state?: string): string[] {
    if (state) {
        return Array.from(new Set(expandedMockVillages.filter(v => v.state === state).map(v => v.district)));
    }
    return Array.from(new Set(expandedMockVillages.map(v => v.district)));
}
