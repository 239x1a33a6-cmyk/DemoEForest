import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const boundariesData = [
    // Jharkhand - East Singhbhum Tribal Areas
    {
        state: 'Jharkhand',
        district: 'East Singhbhum',
        village: 'Pokhariya',
        tribalGroup: 'Santhal',
        boundaryType: 'tribal',
        center: { lat: 22.7800, lng: 86.1800 },
        bbox: { north: 22.7900, south: 22.7700, east: 86.1900, west: 86.1700 },
        geojson: {
            type: 'Feature',
            properties: {
                name: 'Santhal Tribal Area - Pokhariya',
                tribalGroup: 'Santhal',
                village: 'Pokhariya',
                district: 'East Singhbhum',
                state: 'Jharkhand',
                area: '180 hectares'
            },
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [86.1700, 22.7700],
                    [86.1900, 22.7700],
                    [86.1900, 22.7900],
                    [86.1700, 22.7900],
                    [86.1700, 22.7700]
                ]]
            }
        }
    },
    {
        state: 'Jharkhand',
        district: 'East Singhbhum',
        village: 'Bara Chirka',
        tribalGroup: 'Santhal',
        boundaryType: 'tribal',
        center: { lat: 22.7500, lng: 86.2000 },
        bbox: { north: 22.7600, south: 22.7400, east: 86.2100, west: 86.1900 },
        geojson: {
            type: 'Feature',
            properties: {
                name: 'Santhal Tribal Area - Bara Chirka',
                tribalGroup: 'Santhal',
                village: 'Bara Chirka',
                district: 'East Singhbhum',
                state: 'Jharkhand',
                area: '320 hectares'
            },
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [86.1900, 22.7400],
                    [86.2100, 22.7400],
                    [86.2100, 22.7600],
                    [86.1900, 22.7600],
                    [86.1900, 22.7400]
                ]]
            }
        }
    },
    {
        state: 'Jharkhand',
        district: 'East Singhbhum',
        village: 'Chunidih',
        tribalGroup: 'Santhal',
        boundaryType: 'tribal',
        center: { lat: 22.7200, lng: 86.1500 },
        bbox: { north: 22.7300, south: 22.7100, east: 86.1600, west: 86.1400 },
        geojson: {
            type: 'Feature',
            properties: {
                name: 'Santhal Tribal Area - Chunidih',
                tribalGroup: 'Santhal',
                village: 'Chunidih',
                district: 'East Singhbhum',
                state: 'Jharkhand',
                area: '250 hectares'
            },
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [86.1400, 22.7100],
                    [86.1600, 22.7100],
                    [86.1600, 22.7300],
                    [86.1400, 22.7300],
                    [86.1400, 22.7100]
                ]]
            }
        }
    },
    // Telangana - Adilabad Tribal Areas
    {
        state: 'Telangana',
        district: 'Adilabad',
        village: 'Adilabad_Tribal_X',
        tribalGroup: 'Gond',
        boundaryType: 'tribal',
        center: { lat: 19.6600, lng: 78.5300 },
        bbox: { north: 19.6700, south: 19.6500, east: 78.5400, west: 78.5200 },
        geojson: {
            type: 'Feature',
            properties: {
                name: 'Gond Tribal Area - Adilabad_Tribal_X',
                tribalGroup: 'Gond',
                village: 'Adilabad_Tribal_X',
                district: 'Adilabad',
                state: 'Telangana',
                area: '100 hectares'
            },
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [78.5200, 19.6500],
                    [78.5400, 19.6500],
                    [78.5400, 19.6700],
                    [78.5200, 19.6700],
                    [78.5200, 19.6500]
                ]]
            }
        }
    },
    {
        state: 'Telangana',
        district: 'Karimnagar',
        village: 'Karimnagar_Tribal_1',
        tribalGroup: 'Koya',
        boundaryType: 'tribal',
        center: { lat: 18.4400, lng: 79.1300 },
        bbox: { north: 18.4500, south: 18.4300, east: 79.1400, west: 79.1200 },
        geojson: {
            type: 'Feature',
            properties: {
                name: 'Koya Tribal Area - Karimnagar_Tribal_1',
                tribalGroup: 'Koya',
                village: 'Karimnagar_Tribal_1',
                district: 'Karimnagar',
                state: 'Telangana',
                area: '200 hectares'
            },
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [79.1200, 18.4300],
                    [79.1400, 18.4300],
                    [79.1400, 18.4500],
                    [79.1200, 18.4500],
                    [79.1200, 18.4300]
                ]]
            }
        }
    },
    // Madhya Pradesh - Shahdol Tribal Areas
    {
        state: 'Madhya Pradesh',
        district: 'Shahdol',
        village: 'Shahdol_Tribal_A',
        tribalGroup: 'Gond',
        boundaryType: 'tribal',
        center: { lat: 23.3000, lng: 81.3600 },
        bbox: { north: 23.3100, south: 23.2900, east: 81.3700, west: 81.3500 },
        geojson: {
            type: 'Feature',
            properties: {
                name: 'Gond Tribal Area - Shahdol_Tribal_A',
                tribalGroup: 'Gond',
                village: 'Shahdol_Tribal_A',
                district: 'Shahdol',
                state: 'Madhya Pradesh',
                area: '400 hectares'
            },
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [81.3500, 23.2900],
                    [81.3700, 23.2900],
                    [81.3700, 23.3100],
                    [81.3500, 23.3100],
                    [81.3500, 23.2900]
                ]]
            }
        }
    },
    // Odisha - Koraput Tribal Areas
    {
        state: 'Odisha',
        district: 'Koraput',
        village: 'Koraput_Tribal_1',
        tribalGroup: 'Santhal',
        boundaryType: 'tribal',
        center: { lat: 18.8100, lng: 82.7200 },
        bbox: { north: 18.8200, south: 18.8000, east: 82.7300, west: 82.7100 },
        geojson: {
            type: 'Feature',
            properties: {
                name: 'Santhal Tribal Area - Koraput_Tribal_1',
                tribalGroup: 'Santhal',
                village: 'Koraput_Tribal_1',
                district: 'Koraput',
                state: 'Odisha',
                area: '250 hectares'
            },
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [82.7100, 18.8000],
                    [82.7300, 18.8000],
                    [82.7300, 18.8200],
                    [82.7100, 18.8200],
                    [82.7100, 18.8000]
                ]]
            }
        }
    },
    // Tripura - Gomati Tribal Areas
    {
        state: 'Tripura',
        district: 'Gomati',
        village: 'Gomati_Tribal_1',
        tribalGroup: 'Tripuri',
        boundaryType: 'tribal',
        center: { lat: 23.4800, lng: 91.7000 },
        bbox: { north: 23.4900, south: 23.4700, east: 91.7100, west: 91.6900 },
        geojson: {
            type: 'Feature',
            properties: {
                name: 'Tripuri Tribal Area - Gomati_Tribal_1',
                tribalGroup: 'Tripuri',
                village: 'Gomati_Tribal_1',
                district: 'Gomati',
                state: 'Tripura',
                area: '60 hectares'
            },
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [91.6900, 23.4700],
                    [91.7100, 23.4700],
                    [91.7100, 23.4900],
                    [91.6900, 23.4900],
                    [91.6900, 23.4700]
                ]]
            }
        }
    },
    // Administrative boundaries
    {
        state: 'Jharkhand',
        district: 'East Singhbhum',
        village: '',
        boundaryType: 'district',
        center: { lat: 22.7800, lng: 86.1800 },
        bbox: { north: 22.8500, south: 22.7000, east: 86.2500, west: 86.1000 },
        geojson: {
            type: 'Feature',
            properties: {
                name: 'East Singhbhum District',
                district: 'East Singhbhum',
                state: 'Jharkhand',
                area: '3500 square kilometers'
            },
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [86.1000, 22.7000],
                    [86.2500, 22.7000],
                    [86.2500, 22.8500],
                    [86.1000, 22.8500],
                    [86.1000, 22.7000]
                ]]
            }
        }
    },
    {
        state: 'Jharkhand',
        district: 'Ranchi',
        village: '',
        boundaryType: 'district',
        center: { lat: 23.3500, lng: 85.3300 },
        bbox: { north: 23.4000, south: 23.3000, east: 85.4000, west: 85.2500 },
        geojson: {
            type: 'Feature',
            properties: {
                name: 'Ranchi District',
                district: 'Ranchi',
                state: 'Jharkhand',
                area: '5100 square kilometers'
            },
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [85.2500, 23.3000],
                    [85.4000, 23.3000],
                    [85.4000, 23.4000],
                    [85.2500, 23.4000],
                    [85.2500, 23.3000]
                ]]
            }
        }
    },
    {
        state: 'Telangana',
        district: 'Adilabad',
        village: '',
        boundaryType: 'district',
        center: { lat: 19.6600, lng: 78.5300 },
        bbox: { north: 19.7000, south: 19.6000, east: 78.6000, west: 78.4500 },
        geojson: {
            type: 'Feature',
            properties: {
                name: 'Adilabad District',
                district: 'Adilabad',
                state: 'Telangana',
                area: '4200 square kilometers'
            },
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [78.4500, 19.6000],
                    [78.6000, 19.6000],
                    [78.6000, 19.7000],
                    [78.4500, 19.7000],
                    [78.4500, 19.6000]
                ]]
            }
        }
    },
    {
        state: 'Madhya Pradesh',
        district: 'Shahdol',
        village: '',
        boundaryType: 'district',
        center: { lat: 23.3000, lng: 81.3600 },
        bbox: { north: 23.3500, south: 23.2500, east: 81.4500, west: 81.2500 },
        geojson: {
            type: 'Feature',
            properties: {
                name: 'Shahdol District',
                district: 'Shahdol',
                state: 'Madhya Pradesh',
                area: '6200 square kilometers'
            },
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [81.2500, 23.2500],
                    [81.4500, 23.2500],
                    [81.4500, 23.3500],
                    [81.2500, 23.3500],
                    [81.2500, 23.2500]
                ]]
            }
        }
    },
    {
        state: 'Odisha',
        district: 'Koraput',
        village: '',
        boundaryType: 'district',
        center: { lat: 18.8100, lng: 82.7200 },
        bbox: { north: 18.9000, south: 18.7000, east: 82.8000, west: 82.6000 },
        geojson: {
            type: 'Feature',
            properties: {
                name: 'Koraput District',
                district: 'Koraput',
                state: 'Odisha',
                area: '8800 square kilometers'
            },
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [82.6000, 18.7000],
                    [82.8000, 18.7000],
                    [82.8000, 18.9000],
                    [82.6000, 18.9000],
                    [82.6000, 18.7000]
                ]]
            }
        }
    },
    {
        state: 'Tripura',
        district: 'Gomati',
        village: '',
        boundaryType: 'district',
        center: { lat: 23.4800, lng: 91.7000 },
        bbox: { north: 23.5500, south: 23.4000, east: 91.8000, west: 91.6000 },
        geojson: {
            type: 'Feature',
            properties: {
                name: 'Gomati District',
                district: 'Gomati',
                state: 'Tripura',
                area: '1500 square kilometers'
            },
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [91.6000, 23.4000],
                    [91.8000, 23.4000],
                    [91.8000, 23.5500],
                    [91.6000, 23.5500],
                    [91.6000, 23.4000]
                ]]
            }
        }
    }
];

const claimsData = [
    {
        state: 'Jharkhand',
        district: 'East Singhbhum',
        village: 'Pokhariya',
        tribalGroup: 'Santhal',
        individualRights: 120,
        communityRights: 15,
        forestResources: 8,
        totalArea: '180 hectares',
        households: 150,
        approvedCount: 85,
        pendingCount: 35,
        underReviewCount: 10,
        rejectedCount: 5,
        titleDistributedCount: 80,
        approvalRate: '70.8%'
    },
    {
        state: 'Jharkhand',
        district: 'East Singhbhum',
        village: 'Bara Chirka',
        tribalGroup: 'Santhal',
        individualRights: 200,
        communityRights: 25,
        forestResources: 12,
        totalArea: '320 hectares',
        households: 280,
        approvedCount: 150,
        pendingCount: 80,
        underReviewCount: 30,
        rejectedCount: 20,
        titleDistributedCount: 140,
        approvalRate: '75.0%'
    },
    {
        state: 'Telangana',
        district: 'Adilabad',
        village: 'Adilabad_Tribal_X',
        tribalGroup: 'Gond',
        individualRights: 80,
        communityRights: 10,
        forestResources: 5,
        totalArea: '100 hectares',
        households: 90,
        approvedCount: 60,
        pendingCount: 20,
        underReviewCount: 5,
        rejectedCount: 5,
        titleDistributedCount: 55,
        approvalRate: '75.0%'
    },
    {
        state: 'Madhya Pradesh',
        district: 'Shahdol',
        village: 'Shahdol_Tribal_A',
        tribalGroup: 'Gond',
        individualRights: 250,
        communityRights: 30,
        forestResources: 15,
        totalArea: '400 hectares',
        households: 300,
        approvedCount: 200,
        pendingCount: 80,
        underReviewCount: 10,
        rejectedCount: 10,
        titleDistributedCount: 190,
        approvalRate: '80.0%'
    }
];

async function main() {
    console.log('Start seeding ...');

    // Seed Boundaries
    for (const boundary of boundariesData) {
        const createdBoundary = await prisma.boundary.create({
            data: boundary,
        });
        console.log(`Created boundary with id: ${createdBoundary.id}`);
    }

    // Seed Claims
    for (const claim of claimsData) {
        const createdClaim = await prisma.claim.create({
            data: claim,
        });
        console.log(`Created claim with id: ${createdClaim.id}`);
    }

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
