// Database service for FRA layers
import { query, geomToGeoJSON } from './db';

export interface FRALayerQuery {
    type?: 'ifr' | 'cfr' | 'cr' | 'all';
    state?: string;
    district?: string;
    block?: string;
    village?: string;
    claimStatus?: 'filed' | 'pending' | 'approved' | 'rejected';
}

/**
 * Get FRA claims as GeoJSON
 */
export async function getFRAClaims(filters: FRALayerQuery) {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Build WHERE clause
    if (filters.type && filters.type !== 'all') {
        conditions.push(`fc.claim_type = $${paramIndex}`);
        params.push(filters.type.toUpperCase());
        paramIndex++;
    }

    if (filters.claimStatus) {
        conditions.push(`fc.claim_status = $${paramIndex}`);
        params.push(filters.claimStatus);
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

    if (filters.block) {
        conditions.push(`b.name = $${paramIndex}`);
        params.push(filters.block);
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
            fc.id,
            fc.claim_type as type,
            fc.claim_status,
            fc.area_hectares as area,
            fc.claim_date,
            fc.approval_date,
            ph.patta_id,
            ph.name as patta_holder_name,
            ph.tribal_group,
            v.name as village,
            b.name as block,
            d.name as district,
            s.name as state,
            ST_AsGeoJSON(fc.geom)::json as geometry
        FROM fra_claims fc
        JOIN patta_holders ph ON fc.patta_holder_id = ph.id
        JOIN villages v ON ph.village_id = v.id
        JOIN blocks b ON v.block_id = b.id
        JOIN districts d ON b.district_id = d.id
        JOIN states s ON d.state_id = s.id
        ${whereClause}
        ORDER BY fc.claim_date DESC
    `;

    const result = await query(sql, params);

    // Convert to GeoJSON FeatureCollection
    const features = result.rows.map(row => ({
        type: 'Feature',
        geometry: row.geometry,
        properties: {
            id: row.id,
            type: row.type,
            claimStatus: row.claim_status,
            area: row.area,
            claimDate: row.claim_date,
            approvalDate: row.approval_date,
            pattaId: row.patta_id,
            pattaHolderName: row.patta_holder_name,
            tribalGroup: row.tribal_group,
            village: row.village,
            block: row.block,
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
 * Get village boundaries as GeoJSON
 */
export async function getVillageBoundaries(filters: FRALayerQuery) {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

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

    if (filters.block) {
        conditions.push(`b.name = $${paramIndex}`);
        params.push(filters.block);
        paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
        SELECT 
            v.id,
            v.name,
            v.population,
            v.tribal_population,
            v.tribal_percentage,
            v.bpl_percentage,
            v.water_vulnerability,
            v.livelihood_vulnerability,
            b.name as block,
            d.name as district,
            s.name as state,
            ST_AsGeoJSON(v.geom)::json as geometry
        FROM villages v
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
            population: row.population,
            tribalPopulation: row.tribal_population,
            tribalPercentage: row.tribal_percentage,
            bplPercentage: row.bpl_percentage,
            waterVulnerability: row.water_vulnerability,
            livelihoodVulnerability: row.livelihood_vulnerability,
            block: row.block,
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
 * Get district boundaries as GeoJSON
 */
export async function getDistrictBoundaries(state?: string) {
    const whereClause = state ? 'WHERE s.name = $1' : '';
    const params = state ? [state] : [];

    const sql = `
        SELECT 
            d.id,
            d.name,
            s.name as state,
            ST_AsGeoJSON(d.geom)::json as geometry
        FROM districts d
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
            state: row.state,
        }
    }));

    return {
        type: 'FeatureCollection',
        features
    };
}

/**
 * Get state boundaries as GeoJSON
 */
export async function getStateBoundaries() {
    const sql = `
        SELECT 
            id,
            name,
            code,
            ST_AsGeoJSON(geom)::json as geometry
        FROM states
    `;

    const result = await query(sql);

    const features = result.rows.map(row => ({
        type: 'Feature',
        geometry: row.geometry,
        properties: {
            id: row.id,
            name: row.name,
            code: row.code,
        }
    }));

    return {
        type: 'FeatureCollection',
        features
    };
}

/**
 * Get village statistics
 */
export async function getVillageStatistics(villageId: string) {
    const sql = `
        SELECT * FROM village_statistics
        WHERE id = $1
    `;

    const result = await query(sql, [villageId]);
    return result.rows[0] || null;
}

export default {
    getFRAClaims,
    getVillageBoundaries,
    getDistrictBoundaries,
    getStateBoundaries,
    getVillageStatistics,
};
