-- FRA Atlas Database Schema for PostGIS
-- This schema supports the Forest Rights Act (FRA) 2006 implementation

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ADMINISTRATIVE BOUNDARIES
-- ============================================

-- States table
CREATE TABLE states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    geom GEOMETRY(MultiPolygon, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Districts table
CREATE TABLE districts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state_id UUID REFERENCES states(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    geom GEOMETRY(MultiPolygon, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(state_id, name)
);

-- Blocks table
CREATE TABLE blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district_id UUID REFERENCES districts(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10),
    geom GEOMETRY(MultiPolygon, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(district_id, name)
);

-- Villages table
CREATE TABLE villages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    block_id UUID REFERENCES blocks(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10),
    geom GEOMETRY(MultiPolygon, 4326),
    population INTEGER,
    tribal_population INTEGER,
    tribal_percentage DECIMAL(5,2),
    bpl_percentage DECIMAL(5,2),
    forest_dependent_households INTEGER,
    water_vulnerability VARCHAR(20) CHECK (water_vulnerability IN ('low', 'medium', 'high')),
    livelihood_vulnerability VARCHAR(20) CHECK (livelihood_vulnerability IN ('low', 'medium', 'high')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(block_id, name)
);

-- ============================================
-- FRA CLAIMS AND RIGHTS
-- ============================================

-- Patta Holders (Beneficiaries)
CREATE TABLE patta_holders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patta_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    village_id UUID REFERENCES villages(id) ON DELETE CASCADE,
    tribal_group VARCHAR(100),
    traditional_occupation VARCHAR(200),
    contact_number VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FRA Claims
CREATE TABLE fra_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patta_holder_id UUID REFERENCES patta_holders(id) ON DELETE CASCADE,
    claim_type VARCHAR(10) NOT NULL CHECK (claim_type IN ('IFR', 'CR', 'CFR')),
    claim_status VARCHAR(20) NOT NULL CHECK (claim_status IN ('filed', 'pending', 'approved', 'rejected')),
    area_hectares DECIMAL(10,2) NOT NULL,
    geom GEOMETRY(MultiPolygon, 4326),
    claim_date DATE NOT NULL,
    approval_date DATE,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ASSETS AND RESOURCES
-- ============================================

-- Assets (ponds, irrigation, roads, etc.)
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    village_id UUID REFERENCES villages(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    asset_type VARCHAR(50) NOT NULL CHECK (asset_type IN ('pond', 'irrigation', 'road', 'homestead', 'school', 'health', 'forest')),
    geom GEOMETRY(Point, 4326),
    condition VARCHAR(20) CHECK (condition IN ('good', 'fair', 'poor')),
    capacity DECIMAL(10,2),
    year_built INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SCHEMES AND DSS
-- ============================================

-- Government Schemes
CREATE TABLE schemes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    scheme_type VARCHAR(50) NOT NULL CHECK (scheme_type IN ('JJM', 'MGNREGA', 'PM-KISAN', 'DAJGUA', 'OTHER')),
    description TEXT,
    eligibility_criteria JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scheme Recommendations (DSS output)
CREATE TABLE scheme_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    village_id UUID REFERENCES villages(id) ON DELETE CASCADE,
    scheme_id UUID REFERENCES schemes(id) ON DELETE CASCADE,
    priority VARCHAR(20) CHECK (priority IN ('high', 'medium', 'low')),
    estimated_budget DECIMAL(12,2),
    estimated_beneficiaries INTEGER,
    geom GEOMETRY(Point, 4326),
    recommendation_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'implemented', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- VULNERABILITY AND ANALYTICS
-- ============================================

-- Vulnerability Assessments
CREATE TABLE vulnerability_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    village_id UUID REFERENCES villages(id) ON DELETE CASCADE,
    assessment_date DATE NOT NULL,
    water_score DECIMAL(5,2),
    livelihood_score DECIMAL(5,2),
    dss_priority_score DECIMAL(5,2),
    geom GEOMETRY(Point, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Spatial indexes
CREATE INDEX idx_states_geom ON states USING GIST(geom);
CREATE INDEX idx_districts_geom ON districts USING GIST(geom);
CREATE INDEX idx_blocks_geom ON blocks USING GIST(geom);
CREATE INDEX idx_villages_geom ON villages USING GIST(geom);
CREATE INDEX idx_fra_claims_geom ON fra_claims USING GIST(geom);
CREATE INDEX idx_assets_geom ON assets USING GIST(geom);
CREATE INDEX idx_scheme_recommendations_geom ON scheme_recommendations USING GIST(geom);
CREATE INDEX idx_vulnerability_assessments_geom ON vulnerability_assessments USING GIST(geom);

-- Foreign key indexes
CREATE INDEX idx_districts_state_id ON districts(state_id);
CREATE INDEX idx_blocks_district_id ON blocks(district_id);
CREATE INDEX idx_villages_block_id ON villages(block_id);
CREATE INDEX idx_patta_holders_village_id ON patta_holders(village_id);
CREATE INDEX idx_fra_claims_patta_holder_id ON fra_claims(patta_holder_id);
CREATE INDEX idx_assets_village_id ON assets(village_id);
CREATE INDEX idx_scheme_recommendations_village_id ON scheme_recommendations(village_id);
CREATE INDEX idx_vulnerability_assessments_village_id ON vulnerability_assessments(village_id);

-- Search indexes
CREATE INDEX idx_patta_holders_patta_id ON patta_holders(patta_id);
CREATE INDEX idx_villages_name ON villages(name);
CREATE INDEX idx_fra_claims_status ON fra_claims(claim_status);
CREATE INDEX idx_fra_claims_type ON fra_claims(claim_type);

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View for village statistics
CREATE OR REPLACE VIEW village_statistics AS
SELECT 
    v.id,
    v.name as village_name,
    b.name as block_name,
    d.name as district_name,
    s.name as state_name,
    v.population,
    v.tribal_population,
    v.tribal_percentage,
    v.bpl_percentage,
    COUNT(DISTINCT fc.id) FILTER (WHERE fc.claim_status = 'filed') as filed_claims,
    COUNT(DISTINCT fc.id) FILTER (WHERE fc.claim_status = 'pending') as pending_claims,
    COUNT(DISTINCT fc.id) FILTER (WHERE fc.claim_status = 'approved') as approved_claims,
    COUNT(DISTINCT fc.id) FILTER (WHERE fc.claim_status = 'rejected') as rejected_claims,
    COALESCE(SUM(fc.area_hectares) FILTER (WHERE fc.claim_status = 'approved'), 0) as total_approved_area,
    COUNT(DISTINCT a.id) as total_assets,
    v.water_vulnerability,
    v.livelihood_vulnerability
FROM villages v
JOIN blocks b ON v.block_id = b.id
JOIN districts d ON b.district_id = d.id
JOIN states s ON d.state_id = s.id
LEFT JOIN patta_holders ph ON ph.village_id = v.id
LEFT JOIN fra_claims fc ON fc.patta_holder_id = ph.id
LEFT JOIN assets a ON a.village_id = v.id
GROUP BY v.id, v.name, b.name, d.name, s.name, v.population, v.tribal_population, 
         v.tribal_percentage, v.bpl_percentage, v.water_vulnerability, v.livelihood_vulnerability;

-- View for claim analytics
CREATE OR REPLACE VIEW claim_analytics AS
SELECT 
    s.name as state_name,
    d.name as district_name,
    fc.claim_type,
    fc.claim_status,
    COUNT(*) as claim_count,
    SUM(fc.area_hectares) as total_area,
    AVG(fc.area_hectares) as avg_area
FROM fra_claims fc
JOIN patta_holders ph ON fc.patta_holder_id = ph.id
JOIN villages v ON ph.village_id = v.id
JOIN blocks b ON v.block_id = b.id
JOIN districts d ON b.district_id = d.id
JOIN states s ON d.state_id = s.id
GROUP BY s.name, d.name, fc.claim_type, fc.claim_status;
