// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration

// Mock database - In production, replace with actual database
// This would typically be imported from a database service
let claimsDatabase: any[] = [];

import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

// Initialize with real claims data
if (claimsDatabase.length === 0) {
  claimsDatabase = [
    // Jharkhand - East Singhbhum
    {
      id: 'claim_1',
      state: 'Jharkhand',
      district: 'East Singhbhum',
      village: 'Pokhariya',
      tribalGroup: 'Santhal',
      individualRights: 123,
      communityRights: 98,
      forestResources: 45,
      totalArea: '180 hectares',
      households: 45,
      approvedCount: 95,
      pendingCount: 15,
      underReviewCount: 8,
      rejectedCount: 5,
      titleDistributedCount: 90,
      approvalRate: '78%',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 'claim_2',
      state: 'Jharkhand',
      district: 'East Singhbhum',
      village: 'Rechadih',
      tribalGroup: 'Santhal',
      individualRights: 87,
      communityRights: 56,
      forestResources: 29,
      totalArea: '120 hectares',
      households: 32,
      approvedCount: 65,
      pendingCount: 12,
      underReviewCount: 6,
      rejectedCount: 4,
      titleDistributedCount: 60,
      approvalRate: '75%',
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16')
    },
    {
      id: 'claim_3',
      state: 'Jharkhand',
      district: 'East Singhbhum',
      village: 'Chunidih',
      tribalGroup: 'Santhal',
      individualRights: 145,
      communityRights: 110,
      forestResources: 82,
      totalArea: '250 hectares',
      households: 65,
      approvedCount: 120,
      pendingCount: 20,
      underReviewCount: 10,
      rejectedCount: 7,
      titleDistributedCount: 115,
      approvalRate: '80%',
      createdAt: new Date('2024-01-17'),
      updatedAt: new Date('2024-01-17')
    },
    {
      id: 'claim_4',
      state: 'Jharkhand',
      district: 'East Singhbhum',
      village: 'Hatiadih',
      tribalGroup: 'Santhal',
      individualRights: 98,
      communityRights: 70,
      forestResources: 38,
      totalArea: '150 hectares',
      households: 40,
      approvedCount: 75,
      pendingCount: 10,
      underReviewCount: 5,
      rejectedCount: 3,
      titleDistributedCount: 70,
      approvalRate: '81%',
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18')
    },
    {
      id: 'claim_5',
      state: 'Jharkhand',
      district: 'East Singhbhum',
      village: 'Bara Chirka',
      tribalGroup: 'Santhal',
      individualRights: 204,
      communityRights: 150,
      forestResources: 93,
      totalArea: '320 hectares',
      households: 85,
      approvedCount: 180,
      pendingCount: 25,
      underReviewCount: 12,
      rejectedCount: 8,
      titleDistributedCount: 170,
      approvalRate: '82%',
      createdAt: new Date('2024-01-19'),
      updatedAt: new Date('2024-01-19')
    },
    {
      id: 'claim_6',
      state: 'Jharkhand',
      district: 'East Singhbhum',
      village: 'Potkadih',
      tribalGroup: 'Santhal',
      individualRights: 178,
      communityRights: 129,
      forestResources: 76,
      totalArea: '280 hectares',
      households: 75,
      approvedCount: 155,
      pendingCount: 20,
      underReviewCount: 10,
      rejectedCount: 6,
      titleDistributedCount: 145,
      approvalRate: '79%',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: 'claim_7',
      state: 'Jharkhand',
      district: 'East Singhbhum',
      village: 'Chota Chirka',
      tribalGroup: 'Santhal',
      individualRights: 130,
      communityRights: 95,
      forestResources: 54,
      totalArea: '200 hectares',
      households: 55,
      approvedCount: 110,
      pendingCount: 15,
      underReviewCount: 8,
      rejectedCount: 5,
      titleDistributedCount: 105,
      approvalRate: '80%',
      createdAt: new Date('2024-01-21'),
      updatedAt: new Date('2024-01-21')
    },
    {
      id: 'claim_8',
      state: 'Jharkhand',
      district: 'East Singhbhum',
      village: 'Rajahata',
      tribalGroup: 'Santhal',
      individualRights: 111,
      communityRights: 80,
      forestResources: 60,
      totalArea: '170 hectares',
      households: 48,
      approvedCount: 95,
      pendingCount: 12,
      underReviewCount: 6,
      rejectedCount: 4,
      titleDistributedCount: 90,
      approvalRate: '81%',
      createdAt: new Date('2024-01-22'),
      updatedAt: new Date('2024-01-22')
    },
    {
      id: 'claim_9',
      state: 'Jharkhand',
      district: 'East Singhbhum',
      village: 'Palasdih',
      tribalGroup: 'Santhal',
      individualRights: 152,
      communityRights: 120,
      forestResources: 90,
      totalArea: '260 hectares',
      households: 70,
      approvedCount: 135,
      pendingCount: 18,
      underReviewCount: 9,
      rejectedCount: 6,
      titleDistributedCount: 125,
      approvalRate: '83%',
      createdAt: new Date('2024-01-23'),
      updatedAt: new Date('2024-01-23')
    },
    {
      id: 'claim_10',
      state: 'Jharkhand',
      district: 'East Singhbhum',
      village: 'Madhabpur',
      tribalGroup: 'Santhal',
      individualRights: 99,
      communityRights: 72,
      forestResources: 41,
      totalArea: '140 hectares',
      households: 38,
      approvedCount: 80,
      pendingCount: 12,
      underReviewCount: 6,
      rejectedCount: 4,
      titleDistributedCount: 75,
      approvalRate: '78%',
      createdAt: new Date('2024-01-24'),
      updatedAt: new Date('2024-01-24')
    },
    {
      id: 'claim_11',
      state: 'Jharkhand',
      district: 'East Singhbhum',
      village: 'Telidih',
      tribalGroup: 'Santhal',
      individualRights: 135,
      communityRights: 102,
      forestResources: 68,
      totalArea: '220 hectares',
      households: 60,
      approvedCount: 115,
      pendingCount: 15,
      underReviewCount: 8,
      rejectedCount: 5,
      titleDistributedCount: 110,
      approvalRate: '80%',
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-25')
    },
    {
      id: 'claim_12',
      state: 'Jharkhand',
      district: 'East Singhbhum',
      village: 'Gourdih',
      tribalGroup: 'Santhal',
      individualRights: 85,
      communityRights: 60,
      forestResources: 30,
      totalArea: '110 hectares',
      households: 30,
      approvedCount: 70,
      pendingCount: 10,
      underReviewCount: 5,
      rejectedCount: 3,
      titleDistributedCount: 65,
      approvalRate: '79%',
      createdAt: new Date('2024-01-26'),
      updatedAt: new Date('2024-01-26')
    },
    // Jharkhand - Ranchi
    {
      id: 'claim_13',
      state: 'Jharkhand',
      district: 'Ranchi',
      village: 'Ranchi_Tribal_A',
      tribalGroup: 'Munda',
      individualRights: 123,
      communityRights: 98,
      forestResources: 45,
      totalArea: '180 hectares',
      households: 45,
      approvedCount: 95,
      pendingCount: 15,
      underReviewCount: 8,
      rejectedCount: 5,
      titleDistributedCount: 90,
      approvalRate: '78%',
      createdAt: new Date('2024-01-27'),
      updatedAt: new Date('2024-01-27')
    },
    {
      id: 'claim_14',
      state: 'Jharkhand',
      district: 'Ranchi',
      village: 'Chotan_Ranchi_Village',
      tribalGroup: 'Munda',
      individualRights: 87,
      communityRights: 56,
      forestResources: 29,
      totalArea: '120 hectares',
      households: 32,
      approvedCount: 65,
      pendingCount: 12,
      underReviewCount: 6,
      rejectedCount: 4,
      titleDistributedCount: 60,
      approvalRate: '75%',
      createdAt: new Date('2024-01-28'),
      updatedAt: new Date('2024-01-28')
    },
    // Jharkhand - Dumka
    {
      id: 'claim_15',
      state: 'Jharkhand',
      district: 'Dumka',
      village: 'Dumka_Tribal_B',
      tribalGroup: 'Santhal',
      individualRights: 204,
      communityRights: 150,
      forestResources: 93,
      totalArea: '320 hectares',
      households: 85,
      approvedCount: 180,
      pendingCount: 25,
      underReviewCount: 12,
      rejectedCount: 8,
      titleDistributedCount: 170,
      approvalRate: '82%',
      createdAt: new Date('2024-01-29'),
      updatedAt: new Date('2024-01-29')
    },
    {
      id: 'claim_16',
      state: 'Jharkhand',
      district: 'Dumka',
      village: 'Bargi_Tribal_Hamlet',
      tribalGroup: 'Santhal',
      individualRights: 178,
      communityRights: 129,
      forestResources: 76,
      totalArea: '280 hectares',
      households: 75,
      approvedCount: 155,
      pendingCount: 20,
      underReviewCount: 10,
      rejectedCount: 6,
      titleDistributedCount: 145,
      approvalRate: '79%',
      createdAt: new Date('2024-01-30'),
      updatedAt: new Date('2024-01-30')
    },
    // Telangana - Adilabad
    {
      id: 'claim_17',
      state: 'Telangana',
      district: 'Adilabad',
      village: 'Adilabad_Tribal_X',
      tribalGroup: 'Gond',
      individualRights: 66,
      communityRights: 45,
      forestResources: 23,
      totalArea: '100 hectares',
      households: 25,
      approvedCount: 55,
      pendingCount: 8,
      underReviewCount: 4,
      rejectedCount: 2,
      titleDistributedCount: 50,
      approvalRate: '81%',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01')
    },
    {
      id: 'claim_18',
      state: 'Telangana',
      district: 'Adilabad',
      village: 'Gondpalli_Tribal_Village',
      tribalGroup: 'Gond',
      individualRights: 80,
      communityRights: 60,
      forestResources: 30,
      totalArea: '130 hectares',
      households: 35,
      approvedCount: 70,
      pendingCount: 8,
      underReviewCount: 4,
      rejectedCount: 2,
      titleDistributedCount: 65,
      approvalRate: '83%',
      createdAt: new Date('2024-02-02'),
      updatedAt: new Date('2024-02-02')
    },
    // Telangana - Karimnagar
    {
      id: 'claim_19',
      state: 'Telangana',
      district: 'Karimnagar',
      village: 'Karimnagar_Tribal_1',
      tribalGroup: 'Koya',
      individualRights: 122,
      communityRights: 88,
      forestResources: 52,
      totalArea: '200 hectares',
      households: 55,
      approvedCount: 105,
      pendingCount: 12,
      underReviewCount: 6,
      rejectedCount: 4,
      titleDistributedCount: 100,
      approvalRate: '82%',
      createdAt: new Date('2024-02-03'),
      updatedAt: new Date('2024-02-03')
    },
    {
      id: 'claim_20',
      state: 'Telangana',
      district: 'Karimnagar',
      village: 'Bheempur_Tribal_2',
      tribalGroup: 'Koya',
      individualRights: 99,
      communityRights: 72,
      forestResources: 41,
      totalArea: '160 hectares',
      households: 45,
      approvedCount: 85,
      pendingCount: 10,
      underReviewCount: 5,
      rejectedCount: 3,
      titleDistributedCount: 80,
      approvalRate: '81%',
      createdAt: new Date('2024-02-04'),
      updatedAt: new Date('2024-02-04')
    },
    // Tripura - Gomati
    {
      id: 'claim_21',
      state: 'Tripura',
      district: 'Gomati',
      village: 'Gomati_Tribal_1',
      tribalGroup: 'Tripuri',
      individualRights: 35,
      communityRights: 22,
      forestResources: 12,
      totalArea: '60 hectares',
      households: 15,
      approvedCount: 30,
      pendingCount: 4,
      underReviewCount: 2,
      rejectedCount: 1,
      titleDistributedCount: 28,
      approvalRate: '81%',
      createdAt: new Date('2024-02-05'),
      updatedAt: new Date('2024-02-05')
    },
    {
      id: 'claim_22',
      state: 'Tripura',
      district: 'Gomati',
      village: 'Kovilpur_Tribal_Village',
      tribalGroup: 'Tripuri',
      individualRights: 49,
      communityRights: 31,
      forestResources: 18,
      totalArea: '80 hectares',
      households: 20,
      approvedCount: 42,
      pendingCount: 5,
      underReviewCount: 3,
      rejectedCount: 1,
      titleDistributedCount: 40,
      approvalRate: '84%',
      createdAt: new Date('2024-02-06'),
      updatedAt: new Date('2024-02-06')
    },
    // Madhya Pradesh - Shahdol
    {
      id: 'claim_23',
      state: 'Madhya Pradesh',
      district: 'Shahdol',
      village: 'Shahdol_Tribal_A',
      tribalGroup: 'Gond',
      individualRights: 210,
      communityRights: 160,
      forestResources: 120,
      totalArea: '400 hectares',
      households: 100,
      approvedCount: 190,
      pendingCount: 25,
      underReviewCount: 12,
      rejectedCount: 8,
      titleDistributedCount: 180,
      approvalRate: '82%',
      createdAt: new Date('2024-02-07'),
      updatedAt: new Date('2024-02-07')
    },
    {
      id: 'claim_24',
      state: 'Madhya Pradesh',
      district: 'Shahdol',
      village: 'Bhanpur_Tribal_B',
      tribalGroup: 'Gond',
      individualRights: 180,
      communityRights: 128,
      forestResources: 89,
      totalArea: '350 hectares',
      households: 85,
      approvedCount: 165,
      pendingCount: 20,
      underReviewCount: 10,
      rejectedCount: 7,
      titleDistributedCount: 155,
      approvalRate: '81%',
      createdAt: new Date('2024-02-08'),
      updatedAt: new Date('2024-02-08')
    },
    // Odisha - Koraput
    {
      id: 'claim_25',
      state: 'Odisha',
      district: 'Koraput',
      village: 'Koraput_Tribal_1',
      tribalGroup: 'Santhal',
      individualRights: 142,
      communityRights: 101,
      forestResources: 75,
      totalArea: '250 hectares',
      households: 65,
      approvedCount: 125,
      pendingCount: 18,
      underReviewCount: 9,
      rejectedCount: 6,
      titleDistributedCount: 120,
      approvalRate: '81%',
      createdAt: new Date('2024-02-09'),
      updatedAt: new Date('2024-02-09')
    },
    {
      id: 'claim_26',
      state: 'Odisha',
      district: 'Koraput',
      village: 'Laxmipura_Tribal_Village',
      tribalGroup: 'Santhal',
      individualRights: 119,
      communityRights: 90,
      forestResources: 60,
      totalArea: '200 hectares',
      households: 55,
      approvedCount: 105,
      pendingCount: 15,
      underReviewCount: 8,
      rejectedCount: 5,
      titleDistributedCount: 100,
      approvalRate: '82%',
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10')
    },
    // Additional Jharkhand - East Singhbhum villages
    {
      id: 'claim_27',
      state: 'Jharkhand',
      district: 'East Singhbhum',
      village: 'Namsol',
      tribalGroup: 'Santhal',
      individualRights: 140,
      communityRights: 105,
      forestResources: 75,
      totalArea: '240 hectares',
      households: 60,
      approvedCount: 120,
      pendingCount: 15,
      underReviewCount: 8,
      rejectedCount: 5,
      titleDistributedCount: 115,
      approvalRate: '81%',
      createdAt: new Date('2024-02-11'),
      updatedAt: new Date('2024-02-11')
    },
    {
      id: 'claim_28',
      state: 'Jharkhand',
      district: 'East Singhbhum',
      village: 'Rupshan',
      tribalGroup: 'Santhal',
      individualRights: 95,
      communityRights: 70,
      forestResources: 45,
      totalArea: '150 hectares',
      households: 40,
      approvedCount: 80,
      pendingCount: 10,
      underReviewCount: 5,
      rejectedCount: 3,
      titleDistributedCount: 75,
      approvalRate: '80%',
      createdAt: new Date('2024-02-12'),
      updatedAt: new Date('2024-02-12')
    },
    {
      id: 'claim_29',
      state: 'Jharkhand',
      district: 'East Singhbhum',
      village: 'Chirudih',
      tribalGroup: 'Santhal',
      individualRights: 110,
      communityRights: 82,
      forestResources: 50,
      totalArea: '180 hectares',
      households: 50,
      approvedCount: 95,
      pendingCount: 12,
      underReviewCount: 6,
      rejectedCount: 4,
      titleDistributedCount: 90,
      approvalRate: '81%',
      createdAt: new Date('2024-02-13'),
      updatedAt: new Date('2024-02-13')
    }
  ];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const district = searchParams.get('district');
    const village = searchParams.get('village');
    const tribalGroup = searchParams.get('tribalGroup');
    const claimStatus = searchParams.get('claimStatus');

    // Filter records based on query parameters
    let filteredRecords = [...claimsDatabase];

    if (state) {
      filteredRecords = filteredRecords.filter(record => 
        record.state.toLowerCase().includes(state.toLowerCase())
      );
    }

    if (district) {
      filteredRecords = filteredRecords.filter(record => 
        record.district.toLowerCase().includes(district.toLowerCase())
      );
    }

    if (village) {
      filteredRecords = filteredRecords.filter(record => 
        record.village.toLowerCase().includes(village.toLowerCase())
      );
    }

    if (tribalGroup) {
      filteredRecords = filteredRecords.filter(record => 
        record.tribalGroup.toLowerCase().includes(tribalGroup.toLowerCase())
      );
    }

    // If no records found, return appropriate response
    if (filteredRecords.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No claims records found for the specified criteria',
        filters: {
          state: state || null,
          district: district || null,
          village: village || null,
          tribalGroup: tribalGroup || null,
          claimStatus: claimStatus || null
        }
      });
    }

    // Calculate summary statistics
    const summary = calculateSummaryStats(filteredRecords);

    // If specific village/tribal group combination, return detailed data
    if (village && tribalGroup) {
      const detailedRecord = filteredRecords.find(record => 
        record.village.toLowerCase() === village.toLowerCase() &&
        record.tribalGroup.toLowerCase() === tribalGroup.toLowerCase()
      );

      if (detailedRecord) {
        return NextResponse.json({
          success: true,
          data: [detailedRecord],
          summary: summary,
          total: 1,
          message: `Found claims data for ${tribalGroup} tribal group in ${village} village`
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: filteredRecords,
      summary: summary,
      total: filteredRecords.length,
      message: `Found ${filteredRecords.length} claims records`
    });

  } catch (error) {
    console.error('Error fetching claims data:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch claims data',
        message: 'An error occurred while retrieving claims information'
      },
      { status: 500 }
    );
  }
}

function calculateSummaryStats(records: any[]) {
  const totalIndividualRights = records.reduce((sum, record) => sum + record.individualRights, 0);
  const totalCommunityRights = records.reduce((sum, record) => sum + record.communityRights, 0);
  const totalForestResources = records.reduce((sum, record) => sum + record.forestResources, 0);
  const totalHouseholds = records.reduce((sum, record) => sum + record.households, 0);
  const totalApproved = records.reduce((sum, record) => sum + record.approvedCount, 0);
  const totalPending = records.reduce((sum, record) => sum + record.pendingCount, 0);
  const totalUnderReview = records.reduce((sum, record) => sum + record.underReviewCount, 0);
  const totalRejected = records.reduce((sum, record) => sum + record.rejectedCount, 0);
  const totalTitleDistributed = records.reduce((sum, record) => sum + record.titleDistributedCount, 0);

  const totalClaims = totalApproved + totalPending + totalUnderReview + totalRejected;
  const overallApprovalRate = totalClaims > 0 ? Math.round((totalApproved / totalClaims) * 100) : 0;

  return {
    individualRights: totalIndividualRights,
    communityRights: totalCommunityRights,
    forestResources: totalForestResources,
    households: totalHouseholds,
    approvedCount: totalApproved,
    pendingCount: totalPending,
    underReviewCount: totalUnderReview,
    rejectedCount: totalRejected,
    titleDistributedCount: totalTitleDistributed,
    approvalRate: `${overallApprovalRate}%`,
    totalClaims: totalClaims
  };
}
