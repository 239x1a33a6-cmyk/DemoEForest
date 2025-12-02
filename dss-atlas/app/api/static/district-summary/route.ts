// Static Dataset Dashboard Fix — Data source path restored
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

/**
 * GET /api/static/district-summary
 * Returns district-level summary data for CFR analysis from JSON files
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

        // Group data by district and calculate summary
        const districtMap = new Map<string, any>();

        rawData.forEach((row: any) => {
            const district = row.District || row.district || row.DISTRICT;
            if (!district) return;

            if (!districtMap.has(district)) {
                districtMap.set(district, {
                    district: district,
                    total_villages: 0,
                    eligible_villages: 0,
                    total_cfr_potential: 0
                });
            }

            const districtData = districtMap.get(district);
            districtData.total_villages += 1;

            // Count as eligible if has ST population or forest area
            const stPop = row['ST Population'] || row.st_population || 0;
            const forestArea = row['Forest inside revenue boundary (ha)'] || row.forest_area || 0;

            if (stPop > 0 || forestArea > 0) {
                districtData.eligible_villages += 1;
            }

            // Add forest area to CFR potential
            districtData.total_cfr_potential += forestArea || 0;
        });

        // Convert map to array and sort by CFR potential
        const districtData = Array.from(districtMap.values())
            .sort((a, b) => b.total_cfr_potential - a.total_cfr_potential);

        return NextResponse.json({
            success: true,
            data: districtData,
            state: state,
            total_records: rawData.length
        });

    } catch (error: any) {
        console.error('Error fetching district summary:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch district summary data',
            details: error.message
        }, { status: 500 });
    }
}
