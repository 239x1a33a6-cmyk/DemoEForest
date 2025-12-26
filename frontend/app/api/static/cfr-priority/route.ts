// Static Dataset Dashboard Fix — Data source path restored
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import path from 'path';
import fs from 'fs';

/**
 * GET /api/static/cfr-priority
 * Returns CFR priority analysis data from JSON files
 * Query params: state (Odisha, Madhya Pradesh, Maharashtra)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const state = searchParams.get('state') || 'Odisha';

        // Map state names to file names
        const fileMap: Record<string, string> = {
            'Odisha': 'odisha_cfr_data.json',
            'Madhya Pradesh': 'mp_cfr_data.json',
            'Maharashtra': 'mh_cfr_data.json'
        };

        const fileName = fileMap[state];
        if (!fileName) {
            return NextResponse.json({
                success: false,
                error: `No data file found for state: ${state}`
            }, { status: 404 });
        }

        const filePath = path.join(process.cwd(), 'public', 'data', fileName);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({
                success: false,
                error: `Data file not found: ${fileName}`
            }, { status: 404 });
        }

        // Read JSON file
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const rawData: any[] = JSON.parse(fileContent);

        // Calculate priority scores for each village
        const villagesWithPriority = rawData.map((row: any) => {
            const stPop = row['ST Population'] || row.st_population || 0;
            const forestArea = row['Forest inside revenue boundary (ha)'] || row.forest_area || 0;
            const totalPop = row['Total Population'] || row.total_population || 0;

            // Calculate priority score based on ST population and forest area
            // Higher ST population % and more forest area = higher priority
            const stPercentage = totalPop > 0 ? (stPop / totalPop) * 100 : 0;
            const priorityScore = (stPercentage * 0.6) + (Math.min(forestArea / 100, 10) * 0.4);

            return {
                district: row.District || row.district || '',
                taluka: row.Tehsil || row.Block || row.taluka || '',
                village: row.Village || row.village || '',
                cfr_priority_score: priorityScore,
                total_cfr_potential: forestArea,
                st_population: stPop,
                total_population: totalPop
            };
        }).filter(v => v.cfr_priority_score > 0); // Only include villages with some priority

        // Sort by priority score
        villagesWithPriority.sort((a, b) => b.cfr_priority_score - a.cfr_priority_score);

        // Categorize villages by priority
        const highThreshold = 5.0;
        const mediumThreshold = 2.0;

        const highPriority = villagesWithPriority.filter(v => v.cfr_priority_score >= highThreshold);
        const mediumPriority = villagesWithPriority.filter(v => v.cfr_priority_score >= mediumThreshold && v.cfr_priority_score < highThreshold);
        const lowPriority = villagesWithPriority.filter(v => v.cfr_priority_score < mediumThreshold);

        const prioritySummary = [
            { priority_category: 'High', village_count: highPriority.length },
            { priority_category: 'Medium', village_count: mediumPriority.length },
            { priority_category: 'Low', village_count: lowPriority.length }
        ];

        return NextResponse.json({
            success: true,
            data: {
                priority_summary: prioritySummary,
                high_priority_villages: highPriority.slice(0, 50) // Top 50 high priority villages
            },
            state: state,
            total_villages: villagesWithPriority.length
        });

    } catch (error: any) {
        console.error('Error fetching CFR priority data:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch CFR priority data',
            details: error.message
        }, { status: 500 });
    }
}
