// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
import Tesseract from 'tesseract.js';
// @ts-ignore - pdf-parse is a CommonJS module
const pdf = require('pdf-parse');

export interface ParsedPage {
    pageNumber: number;
    text: string;
    embeddedJson: any[];
    claimBlocks: string[];
}

/**
 * Parse PDF and extract text using pdf-parse
 */
export async function parsePDF(
    file: File,
    onProgress?: (page: number, total: number) => void
): Promise<ParsedPage[]> {
    try {
        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Extract text from PDF
        let text = '';
        try {
            const data = await pdf(buffer);
            text = data.text;
        } catch (e) {
            console.warn('PDF parsing failed:', e);
        }

        onProgress?.(1, 1);

        const page: ParsedPage = {
            pageNumber: 1,
            text,
            embeddedJson: extractEmbeddedJson(text),
            claimBlocks: segmentClaimBlocks(text)
        };

        return [page];
    } catch (error) {
        console.error('PDF parsing error:', error);
        // Fallback to empty text
        return [{
            pageNumber: 1,
            text: '',
            embeddedJson: [],
            claimBlocks: []
        }];
    }
}

/**
 * Extract embedded JSON snippets from text
 * Pattern: Structured-sample: { ... } or standalone JSON objects
 */
function extractEmbeddedJson(text: string): any[] {
    const jsonObjects: any[] = [];

    // Pattern 1: Structured-sample: { ... }
    const pattern1 = /Structured-sample:\s*(\{[^}]+\})/gi;
    let match;

    while ((match = pattern1.exec(text)) !== null) {
        try {
            const jsonStr = match[1];
            const parsed = JSON.parse(jsonStr);
            jsonObjects.push(parsed);
        } catch (e) {
            // Invalid JSON, skip
        }
    }

    // Pattern 2: Standalone JSON objects with claim fields
    const pattern2 = /\{[^{}]*"(?:name|village|district|state|lat|lon)"[^{}]*\}/gi;

    while ((match = pattern2.exec(text)) !== null) {
        try {
            const parsed = JSON.parse(match[0]);
            // Check if it looks like a claim object
            if (parsed.name || parsed.village || parsed.district) {
                jsonObjects.push(parsed);
            }
        } catch (e) {
            // Invalid JSON, skip
        }
    }

    return jsonObjects;
}

/**
 * Segment page text into claim blocks
 */
function segmentClaimBlocks(text: string): string[] {
    const blocks: string[] = [];

    // Split by common claim separators
    const separators = [
        /Claim\s+\d+/gi,
        /Name\s+of\s+claimant/gi,
        /Claimant\s+\d+/gi,
        /Claimant[_\s]+\w+/gi,
        /---+/g,
        /={3,}/g
    ];

    let segments = [text];

    for (const separator of separators) {
        const newSegments: string[] = [];
        for (const segment of segments) {
            const parts = segment.split(separator);
            newSegments.push(...parts.filter(p => p.trim().length > 50)); // Min 50 chars
        }
        if (newSegments.length > segments.length) {
            segments = newSegments;
        }
    }

    // If no clear segmentation, treat whole page as one block
    if (segments.length === 1 && segments[0].length > 100) {
        return [segments[0]];
    }

    return segments.filter(s => s.trim().length > 0);
}
