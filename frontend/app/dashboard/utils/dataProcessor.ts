// Exact dashboard replication from DashboardModule
import Papa from 'papaparse';

export interface FRAStateData {
    state: string;
    claims_received_individual: number;
    claims_received_community: number;
    claims_received_total: number;
    titles_distributed_individual: number;
    titles_distributed_community: number;
    titles_distributed_total: number;
    claims_rejected_individual: number;
    claims_rejected_community: number;
    claims_rejected_total: number;
}

export interface DashboardKPIs {
    total_claims: number;
    titles_granted: number;
    digital_verification: number;
    avg_processing_time: number;
    eligible_fra_area: number;
    granted_vs_claimed_percentage: number;
}

// Mock data for missing metrics
const MOCK_ELIGIBLE_AREA = 4500000; // in hectares
const MOCK_DIGITAL_VERIFICATION_RATE = 78.5;
const MOCK_AVG_PROCESSING_TIME = 145;

export const parseCSVData = async (csvText: string): Promise<FRAStateData[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const parsedData: FRAStateData[] = results.data
                    .filter((row: any) => row['State'] && row['State'] !== 'Total')
                    .map((row: any) => ({
                        state: row['State'],
                        claims_received_individual: parseInt(row['Number of Claims Received upto 30-06-2024 - Individual'] || '0', 10),
                        claims_received_community: parseInt(row['NUmber of Claims Received upto 30-06-2024 - Community'] || '0', 10),
                        claims_received_total: parseInt(row['NUmber of Claims Received upto 30-06-2024 - Total'] || '0', 10),
                        titles_distributed_individual: parseInt(row['Number of Titles Distributed upto 30-06-2024 - Individual'] || '0', 10),
                        titles_distributed_community: parseInt(row['Number of Titles Distributed upto 30-06-2024 - Community'] || '0', 10),
                        titles_distributed_total: parseInt(row['Number of Titles Distributed upto 30-06-2024 - Total'] || '0', 10),
                        // These fields are missing in 2024 CSV, so we'll default to 0 or mock if needed
                        claims_rejected_individual: 0,
                        claims_rejected_community: 0,
                        claims_rejected_total: 0,
                    }));
                resolve(parsedData);
            },
            error: (error: any) => {
                reject(error);
            },
        });
    });
};

export const calculateKPIs = (data: FRAStateData[]): DashboardKPIs => {
    const totalClaims = data.reduce((sum, row) => sum + row.claims_received_total, 0);
    const titlesGranted = data.reduce((sum, row) => sum + row.titles_distributed_total, 0);

    // Estimate claimed area (assuming avg 2 hectares per claim for estimation)
    const estimatedClaimedArea = totalClaims * 2;
    const estimatedGrantedArea = titlesGranted * 2;

    return {
        total_claims: totalClaims,
        titles_granted: titlesGranted,
        digital_verification: MOCK_DIGITAL_VERIFICATION_RATE,
        avg_processing_time: MOCK_AVG_PROCESSING_TIME,
        eligible_fra_area: MOCK_ELIGIBLE_AREA,
        granted_vs_claimed_percentage: totalClaims > 0 ? (titlesGranted / totalClaims) * 100 : 0,
    };
};

export const getTopPerformingStates = (data: FRAStateData[], limit = 5) => {
    return [...data]
        .sort((a, b) => {
            const rateA = a.claims_received_total > 0 ? (a.titles_distributed_total / a.claims_received_total) : 0;
            const rateB = b.claims_received_total > 0 ? (b.titles_distributed_total / b.claims_received_total) : 0;
            return rateB - rateA;
        })
        .slice(0, limit)
        .map(state => ({
            name: state.state,
            rate: state.claims_received_total > 0 ? ((state.titles_distributed_total / state.claims_received_total) * 100).toFixed(1) : '0',
            titles: state.titles_distributed_total
        }));
};
