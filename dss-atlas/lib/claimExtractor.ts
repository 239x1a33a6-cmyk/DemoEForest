// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
import type { ParsedPage } from './pdfParser';

export interface ExtractedClaim {
    name?: string;
    spouse?: string;
    father?: string;
    address?: string;
    village?: string;
    gp?: string;
    tehsil?: string;
    district?: string;
    state?: string;
    nature_of_claim?: string;
    extent_ha?: number | null;
    lat?: number | null;
    lon?: number | null;
    disputed?: string;
    evidence?: string;
    structured_json_found: boolean;
    raw_text: string;
    extraction_confidence: number;
}

/**
 * Extract claims from parsed PDF pages
 */
export function extractClaims(pages: ParsedPage[]): ExtractedClaim[] {
    const allClaims: ExtractedClaim[] = [];

    for (const page of pages) {
        // Priority 1: Embedded JSON
        if (page.embeddedJson.length > 0) {
            for (const json of page.embeddedJson) {
                const claim = extractFromJson(json, page.text);
                allClaims.push(claim);
            }
        }

        // Priority 2: Claim blocks
        if (page.claimBlocks.length > 0) {
            for (const block of page.claimBlocks) {
                const claim = extractFromText(block);
                allClaims.push(claim);
            }
        } else if (page.embeddedJson.length === 0) {
            // Fallback: treat whole page as one claim
            const claim = extractFromText(page.text);
            allClaims.push(claim);
        }
    }

    return allClaims;
}

/**
 * Extract claim from embedded JSON
 */
function extractFromJson(json: any, rawText: string): ExtractedClaim {
    return {
        name: json.name || json.claimant || json.holder_name,
        spouse: json.spouse,
        father: json.father || json.guardian,
        address: json.address,
        village: json.village || json.village_name,
        gp: json.gp || json.gram_panchayat,
        tehsil: json.tehsil || json.block,
        district: json.district,
        state: json.state,
        nature_of_claim: json.nature_of_claim || json.claim_type,
        extent_ha: parseFloat(json.extent_ha || json.area_ha || json.area) || null,
        lat: parseFloat(json.lat || json.latitude) || null,
        lon: parseFloat(json.lon || json.longitude) || null,
        disputed: json.disputed,
        evidence: json.evidence,
        structured_json_found: true,
        raw_text: rawText.substring(0, 500),
        extraction_confidence: 0.95
    };
}

/**
 * Extract claim from text using pattern matching
 */
function extractFromText(text: string): ExtractedClaim {
    const claim: ExtractedClaim = {
        structured_json_found: false,
        raw_text: text.substring(0, 500),
        extraction_confidence: 0
    };

    // Extract fields using patterns
    const patterns = {
        name: [
            /(?:name|claimant|holder)[\s:]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/i,
            /Claimant[_\s]+(\w+(?:[_\s]+\w+)*)/i
        ],
        spouse: /(?:spouse|wife|husband)[\s:]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})/i,
        father: /(?:father|guardian|s\/o|d\/o)[\s:]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})/i,
        village: [
            /village[\s:_]+([A-Z][a-z]+(?:[_\s]+[A-Z\d][a-z\d]+)*)/i,
            /Village[_\s]+(\w+(?:[_\s]+\w+)*)/i
        ],
        district: [
            /district[\s:_]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
            /District[_\s]+(\w+(?:[_\s]+\w+)*)/i
        ],
        state: /(Madhya\s+Pradesh|Maharashtra|Odisha|Chhattisgarh|Jharkhand|Andhra\s+Pradesh|Karnataka|Tamil\s+Nadu)/i,
        extent_ha: [
            /extent[\s:]+(\d+\.?\d*)\s*(?:ha|hectare)/i,
            /area[\s:]+(\d+\.?\d*)/i,
            /(\d+\.?\d+)\s*ha/i
        ],
        lat: [
            /lat(?:itude)?[\s:]+(\d{1,2}\.\d{4,})/i,
            /(\d{1,2}\.\d{4,})[°\s]*[NS]/i
        ],
        lon: [
            /lon(?:gitude)?[\s:]+(\d{1,3}\.\d{4,})/i,
            /(\d{1,3}\.\d{4,})[°\s]*[EW]/i
        ]
    };

    let fieldsFound = 0;
    const totalFields = Object.keys(patterns).length;

    for (const [field, patternList] of Object.entries(patterns)) {
        const patternsToTry = Array.isArray(patternList) ? patternList : [patternList];

        for (const pattern of patternsToTry) {
            const match = text.match(pattern);
            if (match && match[1]) {
                const value = match[1].trim();

                if (field === 'extent_ha' || field === 'lat' || field === 'lon') {
                    const num = parseFloat(value);
                    if (!isNaN(num)) {
                        (claim as any)[field] = num;
                        fieldsFound++;
                        break;
                    }
                } else {
                    (claim as any)[field] = value;
                    fieldsFound++;
                    break;
                }
            }
        }
    }

    claim.extraction_confidence = fieldsFound / totalFields;

    return claim;
}
