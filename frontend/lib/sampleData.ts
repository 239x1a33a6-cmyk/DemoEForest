// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration

/**
 * Sample data for fallback when OCR is unavailable
 */
// Temporary local type for ExtractedClaim to satisfy imports until a shared type is available
type ExtractedClaim = any;

export const SAMPLE_DATA: Record<string, ExtractedClaim[]> = {
    'sample_claims_odisha_multi.pdf': [
        {
            name: "Rama K. Nanda",
            spouse: "Sita Nanda",
            father: "Late X. Nanda",
            address: "House 101, Village-101, Odisha",
            village: "Village-101",
            gp: "GP-11",
            tehsil: "Tehsil-1",
            district: "Kandhamal",
            state: "Odisha",
            nature_of_claim: "Habitation and self-cultivation",
            extent_ha: 1.25,
            lat: 20.123456,
            lon: 84.123456,
            disputed: "No",
            evidence: "Community testimony; tenancy records",
            structured_json_found: true,
            raw_text: "Sample data for Rama K. Nanda...",
            extraction_confidence: 0.95
        },
        {
            name: "Shyam S. Pradhan",
            spouse: "Radha Pradhan",
            father: "Late Y. Pradhan",
            address: "House 102, Village-101, Odisha",
            village: "Village-101",
            gp: "GP-11",
            tehsil: "Tehsil-1",
            district: "Kandhamal",
            state: "Odisha",
            nature_of_claim: "Self-cultivation",
            extent_ha: 0.80,
            lat: 20.124567,
            lon: 84.124567,
            disputed: "No",
            evidence: "Voter ID",
            structured_json_found: true,
            raw_text: "Sample data for Shyam S. Pradhan...",
            extraction_confidence: 0.92
        }
    ],
    'sample_claims_maharashtra_multi.pdf': [
        {
            name: "Bhimrao Patil",
            village: "Gadchiroli Village 1",
            district: "Gadchiroli",
            state: "Maharashtra",
            nature_of_claim: "IFR",
            extent_ha: 2.1,
            lat: 19.1234,
            lon: 79.1234,
            structured_json_found: false,
            raw_text: "Claimant: Bhimrao Patil...",
            extraction_confidence: 0.85
        },
        {
            name: "Suresh Gonda",
            village: "Gadchiroli Village 1",
            district: "Gadchiroli",
            state: "Maharashtra",
            nature_of_claim: "IFR",
            extent_ha: 1.5,
            lat: 19.1256,
            lon: 79.1256,
            structured_json_found: false,
            raw_text: "Claimant: Suresh Gonda...",
            extraction_confidence: 0.88
        }
    ],
    'sample_claims_jharkhand.pdf': [
        {
            name: "Birsa Munda",
            village: "Khunti Village A",
            district: "Khunti",
            state: "Jharkhand",
            nature_of_claim: "CFR",
            extent_ha: 15.5,
            lat: 23.1234,
            lon: 85.1234,
            structured_json_found: false,
            raw_text: "Community Claim: Birsa Munda...",
            extraction_confidence: 0.90
        }
    ],
    'sample_claims_mixed_states.pdf': [
        {
            name: "Arjun Singh",
            village: "Village MP 1",
            district: "Mandla",
            state: "Madhya Pradesh",
            nature_of_claim: "IFR",
            extent_ha: 1.1,
            lat: 22.5678,
            lon: 80.5678,
            structured_json_found: false,
            raw_text: "Claimant: Arjun Singh...",
            extraction_confidence: 0.89
        },
        {
            name: "Lakshmi Devi",
            village: "Village CG 1",
            district: "Bastar",
            state: "Chhattisgarh",
            nature_of_claim: "IFR",
            extent_ha: 0.9,
            lat: 19.5678,
            lon: 81.5678,
            structured_json_found: false,
            raw_text: "Claimant: Lakshmi Devi...",
            extraction_confidence: 0.87
        }
    ]
};

export function getSampleData(filename: string): ExtractedClaim[] | null {
    // Check for exact match or if filename contains the key
    for (const [key, data] of Object.entries(SAMPLE_DATA)) {
        if (filename.includes(key) || key.includes(filename)) {
            return data;
        }
    }
    return null;
}
