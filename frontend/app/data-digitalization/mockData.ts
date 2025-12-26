// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration

export const generateMockResponse = (documentType: string, file?: File) => {
  // Generate unique data based on file properties
  const fileHash = file ? `${file.name}-${file.size}-${file.lastModified}` : 'default';
  const uniqueId = Math.abs(hashCode(fileHash)) % 10000;

  // Generate file-specific coordinates
  const baseLat = 22.9876 + (uniqueId % 100) / 10000;
  const baseLng = 81.1234 + (uniqueId % 100) / 10000;

  const baseResponse = {
    metadata: {
      language_detected: "English, Hindi",
      ocr_confidence: `${90 + (uniqueId % 10)}%`,
      extraction_confidence: `${85 + (uniqueId % 15)}%`,
      file_name: file?.name || 'unknown',
      file_size: file?.size || 0,
      file_type: file?.type || 'unknown'
    },
    claim: {
      claim_type: documentType,
      claim_id: `FRA-${uniqueId}`,
      claim_status: "pending",
      claim_area_ha: `${(1.0 + (uniqueId % 50) / 100).toFixed(2)}`,
      survey_number: `${100 + (uniqueId % 200)}/A`,
      supporting_documents_present: "yes"
    },
    claimant: {
      names: [`Claimant-${uniqueId}`],
      guardian_name: `Guardian-${uniqueId}`,
      tribe: "Gond (ST)"
    },
    location: {
      state: "Madhya Pradesh",
      district: ["Dindori", "Mandla", "Balaghat"][uniqueId % 3],
      block: `Block-${uniqueId % 10}`,
      village_name: `Village-${uniqueId}`,
      gram_sabha: `Village-${uniqueId} Gram Sabha`,
      lgd_code: `${450000 + uniqueId}`,
      gps_coordinates: `${baseLat.toFixed(4)}° N, ${baseLng.toFixed(4)}° E`
    },
    verification: {
      frc_remarks: `Claimant has been cultivating land since ${2000 + (uniqueId % 20)}.`,
      sdlc_remarks: "Pending verification of caste certificate.",
      dlc_remarks: ""
    },
    map_data: {
      hand_drawn_map_present: "yes",
      boundary_description: "Bounded by river to the North, forest road to the South.",
      polygon_points: [
        [baseLat, baseLng],
        [baseLat + 0.0004, baseLng + 0.0006],
        [baseLat - 0.0006, baseLng + 0.0016],
        [baseLat - 0.0011, baseLng + 0.0001]
      ],
      confidence_polygon: ["low", "medium", "high"][uniqueId % 3]
    },
    flags: {
      missing_fields: uniqueId % 3 === 0 ? ["household_id"] : [],
      possible_errors: uniqueId % 2 === 0 ? [`Area claimed exceeds average for this region`] : [],
      recommended_manual_check: [`Check boundary overlap with Forest Compartment ${uniqueId % 200}`]
    }
  };

  if (documentType === 'Community Rights (CR)') {
    return {
      ...baseResponse,
      claim: {
        ...baseResponse.claim,
        claim_type: 'CR',
        claim_area_ha: `${(40 + (uniqueId % 60)).toFixed(1)}`,
        survey_number: `Forest Block ${uniqueId % 10}`
      },
      claimant: {
        names: [`${baseResponse.location.village_name} FRC Committee`],
        guardian_name: "",
        tribe: "Gond, Baiga"
      },
      map_data: {
        ...baseResponse.map_data,
        confidence_polygon: "high",
        boundary_description: "Traditional grazing grounds and collection area."
      }
    };
  }

  return baseResponse;
};

// Simple hash function for generating consistent IDs from file properties
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
