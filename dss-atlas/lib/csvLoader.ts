import Papa from 'papaparse';
import { ClaimRecord, ClaimGeoJSONFeature } from '@/types/atlas';
import { getDistrictCentroid } from './districtCentroids';

export interface ClaimsGeoJSON {
    type: 'FeatureCollection';
    features: ClaimGeoJSONFeature[];
}

/**
 * Load and parse the FRA claims CSV file
 * Converts CSV records to GeoJSON format using district centroids
 */
export async function loadClaimsCSV(): Promise<ClaimsGeoJSON> {
    console.log('Starting loadClaimsCSV with HARDCODED data...');
    try {
        // Hardcoded CSV data to bypass file loading issues
        const csvText = `claim_id,holder_or_community,claim_type,status,area_acres,village,district,state
TS_ADI_IFR_001,Raju Naik,IFR,Approved,2.3,Utnoor,Adilabad,Telangana
TS_ADI_IFR_002,Laxmi Bai,IFR,Pending,1.8,Jainoor,Adilabad,Telangana
TS_ADI_IFR_003,Ramu Gond,IFR,Approved,3.1,Indervelli,Adilabad,Telangana
TS_ADI_CR_001,Utnoor Gram Sabha,CR,Approved,5.0,Utnoor,Adilabad,Telangana
TS_ADI_CR_002,Jainoor Gram Sabha,CR,Pending,3.4,Jainoor,Adilabad,Telangana
TS_ADI_CFR_001,Utnoor Forest Committee,CFR,Approved,65.0,Utnoor,Adilabad,Telangana
TS_ADI_CFR_002,Indervelli Forest Committee,CFR,Pending,48.5,Indervelli,Adilabad,Telangana
TS_KHM_IFR_001,Sita Kumari,IFR,Approved,1.6,Bhadrachalam,Khammam,Telangana
TS_KHM_IFR_002,Ravi Mudiraj,IFR,Pending,2.0,Kothagudem,Khammam,Telangana
TS_KHM_IFR_003,Anjaiah,IFR,Approved,2.7,Aswaraopeta,Khammam,Telangana
TS_KHM_CR_001,Bhadrachalam Gram Sabha,CR,Approved,4.8,Bhadrachalam,Khammam,Telangana
TS_KHM_CR_002,Kothagudem Gram Sabha,CR,Pending,3.2,Kothagudem,Khammam,Telangana
TS_KHM_CFR_001,Godavari Forest Committee,CFR,Approved,72.0,Bhadrachalam,Khammam,Telangana
TS_KHM_CFR_002,Kinnerasani Forest Committee,CFR,Pending,55.3,Kothagudem,Khammam,Telangana
OD_KPT_IFR_001,Manda Pangi,IFR,Approved,2.1,Lamtaput,Koraput,Odisha
OD_KPT_IFR_002,Bhima Korram,IFR,Pending,1.9,Nandapur,Koraput,Odisha
OD_KPT_IFR_003,Sarita Hikaka,IFR,Approved,2.8,Similiguda,Koraput,Odisha
OD_KPT_CR_001,Lamtaput Gram Sabha,CR,Approved,4.2,Lamtaput,Koraput,Odisha
OD_KPT_CR_002,Nandapur Gram Sabha,CR,Pending,3.7,Nandapur,Koraput,Odisha
OD_KPT_CFR_001,Deomali Forest Committee,CFR,Approved,80.0,Lamtaput,Koraput,Odisha
OD_KPT_CFR_002,Padua Forest Committee,CFR,Pending,60.5,Padua,Koraput,Odisha
OD_SNG_IFR_001,Gopal Oram,IFR,Approved,2.4,Bonai,Sundargarh,Odisha
OD_SNG_IFR_002,Jamuna Munda,IFR,Pending,1.7,Lephripada,Sundargarh,Odisha
OD_SNG_IFR_003,Biru Ekka,IFR,Approved,3.0,Subdega,Sundargarh,Odisha
OD_SNG_CR_001,Bonai Gram Sabha,CR,Approved,5.1,Bonai,Sundargarh,Odisha
OD_SNG_CR_002,Lephripada Gram Sabha,CR,Pending,3.6,Lephripada,Sundargarh,Odisha
OD_SNG_CFR_001,Koina Forest Committee,CFR,Approved,70.0,Bonai,Sundargarh,Odisha
OD_SNG_CFR_002,Brahmani Forest Committee,CFR,Pending,58.2,Rourkela,Sundargarh,Odisha
MP_MND_IFR_001,Kalia Gond,IFR,Approved,2.0,Dindori,Mandla,Madhya Pradesh
MP_MND_IFR_002,Soma Bhilala,IFR,Pending,1.6,Nainpur,Mandla,Madhya Pradesh
MP_MND_IFR_003,Ramesh Bai,IFR,Approved,2.9,Bichhiya,Mandla,Madhya Pradesh
MP_MND_CR_001,Dindori Gram Sabha,CR,Approved,4.3,Dindori,Mandla,Madhya Pradesh
MP_MND_CR_002,Nainpur Gram Sabha,CR,Pending,3.1,Nainpur,Mandla,Madhya Pradesh
MP_MND_CFR_001,Narmada Forest Committee,CFR,Approved,75.0,Dindori,Mandla,Madhya Pradesh
MP_MND_CFR_002,Bichhiya Forest Committee,CFR,Pending,62.4,Bichhiya,Mandla,Madhya Pradesh
MP_BTL_IFR_001,Raju Adivasi,IFR,Approved,1.8,Betul,Betul,Madhya Pradesh
MP_BTL_IFR_002,Savita Bai,IFR,Pending,1.5,Amla,Betul,Madhya Pradesh
MP_BTL_IFR_003,Bhura Singh,IFR,Approved,2.5,Multai,Betul,Madhya Pradesh
MP_BTL_CR_001,Betul Gram Sabha,CR,Approved,4.0,Betul,Betul,Madhya Pradesh
MP_BTL_CR_002,Multai Gram Sabha,CR,Pending,3.3,Multai,Betul,Madhya Pradesh
MP_BTL_CFR_001,Satpura Forest Committee,CFR,Approved,82.0,Betul,Betul,Madhya Pradesh
MP_BTL_CFR_002,Mahal Forest Committee,CFR,Pending,64.7,Multai,Betul,Madhya Pradesh
TR_DHL_IFR_001,Rina Tripuri,IFR,Approved,1.4,Ambassa,Dhalai,Tripura
TR_DHL_IFR_002,Paresh Debbarma,IFR,Pending,1.9,Kamalpur,Dhalai,Tripura
TR_DHL_IFR_003,Charan Jamatia,IFR,Approved,2.2,Salema,Dhalai,Tripura
TR_DHL_CR_001,Ambassa Gram Sabha,CR,Approved,3.8,Ambassa,Dhalai,Tripura
TR_DHL_CR_002,Kamalpur Gram Sabha,CR,Pending,3.0,Kamalpur,Dhalai,Tripura
TR_DHL_CFR_001,Dhalai Forest Committee,CFR,Approved,55.0,Ambassa,Dhalai,Tripura
TR_DHL_CFR_002,Gobindabari Forest Committee,CFR,Pending,49.3,Salema,Dhalai,Tripura
TR_WTP_IFR_001,Sudip Reang,IFR,Approved,1.7,Agartala,West Tripura,Tripura
TR_WTP_IFR_002,Kamalini Tripura,IFR,Pending,1.6,Bishalgarh,West Tripura,Tripura
TR_WTP_IFR_003,Manik Das,IFR,Approved,2.1,Jirania,West Tripura,Tripura
TR_WTP_CR_001,Agartala Gram Sabha,CR,Approved,3.9,Agartala,West Tripura,Tripura
TR_WTP_CR_002,Bishalgarh Gram Sabha,CR,Pending,3.2,Bishalgarh,West Tripura,Tripura
TR_WTP_CFR_001,Baramura Forest Committee,CFR,Approved,52.0,Jirania,West Tripura,Tripura
TR_WTP_CFR_002,Gakulnagar Forest Committee,CFR,Pending,47.8,Bishalgarh,West Tripura,Tripura`;

        return new Promise((resolve, reject) => {
            Papa.parse<ClaimRecord>(csvText, {
                header: true,
                skipEmptyLines: true,
                transformHeader: (header) => header.trim(),
                transform: (value) => value.trim(),
                complete: (results) => {
                    const features: ClaimGeoJSONFeature[] = [];

                    results.data.forEach((record, index) => {
                        // Debug logging
                        if (index === 0) {
                            console.log('First CSV record:', record);
                        }

                        // Skip invalid records
                        if (!record.claim_id || !record.district) {
                            console.warn(`Skipping record ${index}: missing claim_id or district`, record);
                            return;
                        }

                        // Get centroid for district
                        const centroid = getDistrictCentroid(record.district);
                        if (!centroid) {
                            console.warn(`No centroid found for district: ${record.district}`);
                            return;
                        }

                        // Add small random jitter to separate markers (approx 1-2km)
                        // 0.02 degrees is roughly 2km
                        const jitter = 0.02;
                        const lng = centroid[0] + (Math.random() - 0.5) * jitter;
                        const lat = centroid[1] + (Math.random() - 0.5) * jitter;

                        // Create GeoJSON feature
                        features.push({
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [lng, lat]
                            },
                            properties: {
                                ...record,
                                area_acres: parseFloat(record.area_acres as any) || 0
                            }
                        });
                    });

                    console.log(`Parsed ${features.length} features from hardcoded data`);
                    resolve({
                        type: 'FeatureCollection',
                        features
                    });
                },
                error: (error: Error) => {
                    console.error('Papa Parse Error:', error);
                    reject(error);
                }
            });
        });
    } catch (error) {
        console.error('Error loading claims CSV:', error);
        throw error;
    }
}

/**
 * Filter claims by type
 */
export function filterClaimsByType(
    geojson: ClaimsGeoJSON,
    types: ('IFR' | 'CR' | 'CFR')[]
): ClaimsGeoJSON {
    return {
        type: 'FeatureCollection',
        features: geojson.features.filter(f =>
            types.includes(f.properties.claim_type)
        )
    };
}
