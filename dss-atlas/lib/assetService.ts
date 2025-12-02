// Database service for assets and vulnerability data
import { query } from './db';

export interface AssetQuery {
    state?: string;
    district?: string;
    village?: string;
    assetType?: 'pond' | 'irrigation' | 'road' | 'homestead' | 'school' | 'health' | 'forest';
}

/**
 * Get assets as GeoJSON
 */
export async function getAssets(filters: AssetQuery) {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.assetType) {
        conditions.push(`a.asset_type = $${paramIndex}`);
        params.push(filters.assetType);
        paramIndex++;
    }

    if (filters.state) {
        conditions.push(`s.name = $${paramIndex}`);
        params.push(filters.state);
        paramIndex++;
    }

    if (filters.district) {
        conditions.push(`d.name = $${paramIndex}`);
        params.push(filters.district);
        paramIndex++;
    }

    if (filters.village) {
        conditions.push(`v.name = $${paramIndex}`);
        params.push(filters.village);
        paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
        SELECT 
            a.id,
            a.name,
            a.asset_type,
            a.condition,
            a.capacity,
            a.year_built,
            v.name as village,
            d.name as district,
            s.name as state,
            ST_AsGeoJSON(a.geom)::json as geometry
        FROM assets a
        JOIN villages v ON a.village_id = v.id
        JOIN blocks b ON v.block_id = b.id
        JOIN districts d ON b.district_id = d.id
        JOIN states s ON d.state_id = s.id
        ${whereClause}
    `;

    const result = await query(sql, params);

    const features = result.rows.map(row => ({
        type: 'Feature',
        geometry: row.geometry,
        properties: {
            id: row.id,
            name: row.name,
            type: row.asset_type,
            condition: row.condition,
            capacity: row.capacity,
            year: row.year_built,
            village: row.village,
            district: row.district,
            state: row.state,
        }
    }));

    return {
        type: 'FeatureCollection',
        features
    };
}

/**
 * Get vulnerability assessments
 */
export async function getVulnerabilityData(state?: string, district?: string) {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (state) {
        conditions.push(`s.name = $${paramIndex}`);
        params.push(state);
        paramIndex++;
    }

    if (district) {
        conditions.push(`d.name = $${paramIndex}`);
        params.push(district);
        paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
        SELECT 
            va.id,
            va.water_score,
            va.livelihood_score,
            va.dss_priority_score,
            va.assessment_date,
            v.name as village,
            v.water_vulnerability,
            v.livelihood_vulnerability,
            d.name as district,
            s.name as state,
            ST_AsGeoJSON(va.geom)::json as geometry
        FROM vulnerability_assessments va
        JOIN villages v ON va.village_id = v.id
        JOIN blocks b ON v.block_id = b.id
        JOIN districts d ON b.district_id = d.id
        JOIN states s ON d.state_id = s.id
        ${whereClause}
        ORDER BY va.assessment_date DESC
    `;

    const result = await query(sql, params);

    // Convert to heatmap format
    const heatmapData = result.rows.map(row => ({
        type: 'Feature',
        geometry: row.geometry,
        properties: {
            id: row.id,
            waterScore: row.water_score,
            livelihoodScore: row.livelihood_score,
            dssPriorityScore: row.dss_priority_score,
            waterVulnerability: row.water_vulnerability,
            livelihoodVulnerability: row.livelihood_vulnerability,
            village: row.village,
            district: row.district,
            state: row.state,
            assessmentDate: row.assessment_date,
        }
    }));

    return {
        type: 'FeatureCollection',
        features: heatmapData
    };
}

/**
 * Get scheme recommendations
 */
export async function getSchemeRecommendations(state?: string, district?: string) {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (state) {
        conditions.push(`s.name = $${paramIndex}`);
        params.push(state);
        paramIndex++;
    }

    if (district) {
        conditions.push(`d.name = $${paramIndex}`);
        params.push(district);
        paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
        SELECT 
            sr.id,
            sr.priority,
            sr.estimated_budget,
            sr.estimated_beneficiaries,
            sr.status,
            sc.name as scheme_name,
            sc.scheme_type,
            sc.description,
            v.name as village,
            d.name as district,
            s.name as state,
            ST_AsGeoJSON(sr.geom)::json as geometry
        FROM scheme_recommendations sr
        JOIN schemes sc ON sr.scheme_id = sc.id
        JOIN villages v ON sr.village_id = v.id
        JOIN blocks b ON v.block_id = b.id
        JOIN districts d ON b.district_id = d.id
        JOIN states s ON d.state_id = s.id
        ${whereClause}
        ORDER BY sr.priority DESC, sr.estimated_beneficiaries DESC
    `;

    const result = await query(sql, params);

    return result.rows.map(row => ({
        id: row.id,
        name: row.scheme_name,
        type: row.scheme_type,
        description: row.description,
        priority: row.priority,
        estimatedBudget: row.estimated_budget,
        beneficiaries: row.estimated_beneficiaries,
        status: row.status,
        village: row.village,
        district: row.district,
        state: row.state,
        coordinates: row.geometry.coordinates,
    }));
}

/**
 * Get analytics data
 */
export async function getAnalyticsData(state?: string, district?: string) {
    const stateFilter = state ? 'AND s.name = $1' : '';
    const districtFilter = district ? 'AND d.name = $2' : '';
    const params = [];
    if (state) params.push(state);
    if (district) params.push(district);

    // Get overview statistics
    const overviewSql = `
        SELECT 
            COUNT(DISTINCT fc.id) as total_claims,
            COUNT(DISTINCT fc.id) FILTER (WHERE fc.claim_status = 'approved') as approved_claims,
            COUNT(DISTINCT fc.id) FILTER (WHERE fc.claim_status = 'pending') as pending_claims,
            COUNT(DISTINCT fc.id) FILTER (WHERE fc.claim_status = 'rejected') as rejected_claims,
            COALESCE(SUM(fc.area_hectares), 0) as total_area,
            COUNT(DISTINCT ph.id) as total_beneficiaries
        FROM fra_claims fc
        JOIN patta_holders ph ON fc.patta_holder_id = ph.id
        JOIN villages v ON ph.village_id = v.id
        JOIN blocks b ON v.block_id = b.id
        JOIN districts d ON b.district_id = d.id
        JOIN states s ON d.state_id = s.id
        WHERE 1=1 ${stateFilter} ${districtFilter}
    `;

    const overviewResult = await query(overviewSql, params);

    // Get by type statistics
    const byTypeSql = `
        SELECT 
            claim_type,
            COUNT(*) as count,
            COALESCE(SUM(area_hectares), 0) as area
        FROM fra_claims fc
        JOIN patta_holders ph ON fc.patta_holder_id = ph.id
        JOIN villages v ON ph.village_id = v.id
        JOIN blocks b ON v.block_id = b.id
        JOIN districts d ON b.district_id = d.id
        JOIN states s ON d.state_id = s.id
        WHERE 1=1 ${stateFilter} ${districtFilter}
        GROUP BY claim_type
    `;

    const byTypeResult = await query(byTypeSql, params);

    const byType = {
        ifr: { count: 0, area: 0 },
        cr: { count: 0, area: 0 },
        cfr: { count: 0, area: 0 },
    };

    byTypeResult.rows.forEach(row => {
        const type = row.claim_type.toLowerCase() as 'ifr' | 'cr' | 'cfr';
        if (type in byType) {
            byType[type] = { count: parseInt(row.count), area: parseFloat(row.area) };
        }
    });

    return {
        overview: overviewResult.rows[0],
        byType,
    };
}

export default {
    getAssets,
    getVulnerabilityData,
    getSchemeRecommendations,
    getAnalyticsData,
};
