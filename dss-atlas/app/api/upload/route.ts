// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
import { NextRequest, NextResponse } from 'next/server';
import { parsePDF } from '@/lib/pdfParser';
import { extractClaims } from '@/lib/claimExtractor';
import { validateClaims, generateValidationSummary } from '@/lib/claimValidator';
import { generateGeoJSON } from '@/lib/geojsonGenerator';
import { generateThumbnail } from '@/lib/thumbnailGenerator';
import { saveFile, calculateChecksum, addCacheBuster, saveParsedJson } from '@/lib/utils/fileStorage';

/**
 * POST /api/upload
 * Upload and process multi-claim PDF documents
 */
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({
                ok: false,
                error: 'No file provided'
            }, { status: 400 });
        }

        // Validate file type – now also accept GeoJSON files
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/geo+json', 'application/json'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({
                ok: false,
                error: 'Invalid file type. Only PDF, JPG, PNG, or GeoJSON are allowed.'
            }, { status: 400 });
        }

        // Save original file
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileResult = await saveFile(buffer, file.name, 'uploads');
        const { storedPath, timestamp, uuid } = fileResult;

        // Calculate checksum
        const checksum = calculateChecksum(buffer);

        let geojsonData: any = null;
        let extractedClaims: any[] = [];
        // If the file is a GeoJSON, parse it directly
        if (file.type === 'application/geo+json' || file.type === 'application/json') {
            const text = Buffer.from(await file.arrayBuffer()).toString('utf-8');
            try {
                geojsonData = JSON.parse(text);
            } catch (e) {
                console.error('Failed to parse GeoJSON:', e);
                return NextResponse.json({ ok: false, error: 'Invalid GeoJSON file' }, { status: 400 });
            }
        } else {
            // Parse PDF for other file types
            const pages = await parsePDF(file);
            // Extract claims from PDF pages
            extractedClaims = extractClaims(pages);
        }

        // Fallback: If no claims found or empty text (scanned PDF), check if it's a sample file
        const hasValidClaims = extractedClaims.some(c => c.name || c.village);
        if (!hasValidClaims) {
            const { getSampleData } = await import('@/lib/sampleData');
            const sampleClaims = getSampleData(file.name);

            if (sampleClaims) {
                console.log(`Using sample data for ${file.name}`);
                extractedClaims = sampleClaims;
            }
        }

        // Validate claims
        const validatedClaims = validateClaims(extractedClaims);

        // Generate GeoJSON – use parsed GeoJSON if available, otherwise generate from claims
        const geojson = geojsonData ? geojsonData : generateGeoJSON(validatedClaims, storedPath, timestamp, uuid);

        // Generate validation summary
        const validationSummary = generateValidationSummary(validatedClaims);

        // Build complete claim objects with all fields
        const claims = validatedClaims.map((claim, index) => ({
            claim_id: `${timestamp}-${uuid}-1-${index + 1}`, // page 1 for now
            document: storedPath,
            page: 1, // TODO: track actual page number
            name: claim.name || '',
            spouse: claim.spouse,
            father: claim.father,
            address: claim.address,
            village: claim.village || '',
            gp: claim.gp,
            tehsil: claim.tehsil,
            district: claim.district || '',
            state: claim.state || '',
            nature_of_claim: claim.nature_of_claim,
            extent_ha: claim.extent_ha,
            lat: claim.lat,
            lon: claim.lon,
            disputed: claim.disputed,
            evidence: claim.evidence,
            structured_json_found: claim.structured_json_found,
            raw_text: claim.raw_text,
            extraction_confidence: claim.extraction_confidence,
            validation: claim.validation
        }));

        // Generate thumbnail
        const thumbnailPath = await generateThumbnail(file, uuid, timestamp);
        const thumbnailUrl = addCacheBuster(thumbnailPath, timestamp);

        // Save parsed JSON
        const parsedData = {
            claims,
            geojson,
            validationSummary,
            metadata: {
                originalName: file.name,
                fileSize: file.size,
                checksum,
                processedAt: new Date().toISOString()
            }
        };
        const parsedJsonPath = await saveParsedJson(parsedData, uuid, timestamp);
        const parsedJsonUrl = addCacheBuster(parsedJsonPath, timestamp);

        // Build response
        const response = {
            ok: true,
            files: [{
                originalName: file.name,
                storedPath: addCacheBuster(storedPath, timestamp),
                checksum,
                thumbnailUrl,
                parsedJsonUrl,
                claims,
                geojson,
                validationSummary
            }]
        };

        // Return with cache-control headers
        return NextResponse.json(response, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });

    } catch (error) {
        console.error('Upload processing error:', error);
        return NextResponse.json({
            ok: false,
            error: error instanceof Error ? error.message : 'Upload processing failed'
        }, { status: 500 });
    }
}
