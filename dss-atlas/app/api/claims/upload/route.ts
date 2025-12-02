// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
import { promises as fs } from 'fs';
import path from 'path';

// Database schema for claims records
interface ClaimsRecord {
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
  createdAt: Date;
  updatedAt: Date;
}

// Mock database - In production, replace with actual database
let claimsDatabase: ClaimsRecord[] = [];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    if (!['csv', 'json'].includes(fileType || '')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload CSV or JSON files only.' },
        { status: 400 }
      );
    }

    const fileContent = await file.text();
    let records: any[] = [];

    if (fileType === 'csv') {
      records = parseCSV(fileContent);
    } else if (fileType === 'json') {
      records = JSON.parse(fileContent);
    }

    // Validate and process records
    const processedRecords = records.map((record, index) => {
      const processedRecord: ClaimsRecord = {
        id: `claim_${Date.now()}_${index}`,
        state: record.State || record.state || '',
        district: record.District || record.district || '',
        village: record.Village || record.village || '',
        tribalGroup: record.TribalGroup || record.tribalGroup || '',
        individualRights: parseInt(record.IndividualRights || record.individualRights || '0'),
        communityRights: parseInt(record.CommunityRights || record.communityRights || '0'),
        forestResources: parseInt(record.ForestResources || record.forestResources || '0'),
        totalArea: record.TotalArea || record.totalArea || '0 hectares',
        households: parseInt(record.Households || record.households || '0'),
        approvedCount: parseInt(record.ApprovedCount || record.approvedCount || '0'),
        pendingCount: parseInt(record.PendingCount || record.pendingCount || '0'),
        underReviewCount: parseInt(record.UnderReviewCount || record.underReviewCount || '0'),
        rejectedCount: parseInt(record.RejectedCount || record.rejectedCount || '0'),
        titleDistributedCount: parseInt(record.TitleDistributedCount || record.titleDistributedCount || '0'),
        approvalRate: calculateApprovalRate(
          parseInt(record.ApprovedCount || record.approvedCount || '0'),
          parseInt(record.PendingCount || record.pendingCount || '0'),
          parseInt(record.UnderReviewCount || record.underReviewCount || '0'),
          parseInt(record.RejectedCount || record.rejectedCount || '0')
        ),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      return processedRecord;
    });

    // Update database (in production, use actual database operations)
    const existingIndices: number[] = [];
    processedRecords.forEach(newRecord => {
      const existingIndex = claimsDatabase.findIndex(
        existing => 
          existing.state === newRecord.state &&
          existing.district === newRecord.district &&
          existing.village === newRecord.village &&
          existing.tribalGroup === newRecord.tribalGroup
      );
      
      if (existingIndex !== -1) {
        // Update existing record
        claimsDatabase[existingIndex] = { ...newRecord, id: claimsDatabase[existingIndex].id };
        existingIndices.push(existingIndex);
      } else {
        // Add new record
        claimsDatabase.push(newRecord);
      }
    });

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${processedRecords.length} records`,
      recordsProcessed: processedRecords.length,
      recordsUpdated: existingIndices.length,
      recordsAdded: processedRecords.length - existingIndices.length
    });

  } catch (error) {
    console.error('Error processing file upload:', error);
    return NextResponse.json(
      { error: 'Failed to process file upload' },
      { status: 500 }
    );
  }
}

function parseCSV(csvContent: string): any[] {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const record: any = {};
      
      headers.forEach((header, index) => {
        record[header] = values[index] || '';
      });
      
      records.push(record);
    }
  }

  return records;
}

function calculateApprovalRate(approved: number, pending: number, underReview: number, rejected: number): string {
  const total = approved + pending + underReview + rejected;
  if (total === 0) return '0%';
  
  const rate = Math.round((approved / total) * 100);
  return `${rate}%`;
}

// GET endpoint to retrieve all claims data (for admin purposes)
export async function GET() {
  return NextResponse.json({
    success: true,
    data: claimsDatabase,
    total: claimsDatabase.length
  });
}
