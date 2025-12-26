# Database Setup Guide for FRA Atlas

This guide will help you set up the PostGIS database for the FRA Atlas application.

## Prerequisites

- PostgreSQL 12+ installed
- PostGIS extension installed
- Database admin access

## Installation Steps

### 1. Install PostgreSQL and PostGIS

**Windows:**
```bash
# Download and install PostgreSQL from https://www.postgresql.org/download/windows/
# PostGIS is included in the Windows installer
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib postgis
```

**macOS:**
```bash
brew install postgresql postgis
```

### 2. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE fra_atlas;

# Connect to the database
\c fra_atlas

# Enable PostGIS extension
CREATE EXTENSION postgis;
CREATE EXTENSION "uuid-ossp";

# Exit psql
\q
```

### 3. Run Schema Migration

```bash
# From the project root directory
psql -U postgres -d fra_atlas -f database/schema.sql
```

### 4. Configure Environment Variables

Update your `.env.local` file with your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fra_atlas
DB_USER=postgres
DB_PASSWORD=your_actual_password_here
```

### 5. Verify Connection

```bash
# Test database connection
npm run db:test
```

## Data Import

### Option 1: Sample Data (for testing)

```bash
# Import sample data
npm run db:seed
```

### Option 2: Real Data Import

#### Import from CSV

```bash
# Import states
psql -U postgres -d fra_atlas -c "\COPY states(name, code) FROM 'data/states.csv' CSV HEADER"

# Import districts
psql -U postgres -d fra_atlas -c "\COPY districts(state_id, name, code) FROM 'data/districts.csv' CSV HEADER"

# Import villages
psql -U postgres -d fra_atlas -c "\COPY villages(block_id, name, population, tribal_population) FROM 'data/villages.csv' CSV HEADER"

# Import FRA claims
psql -U postgres -d fra_atlas -c "\COPY fra_claims(patta_holder_id, claim_type, claim_status, area_hectares, claim_date) FROM 'data/claims.csv' CSV HEADER"
```

#### Import GeoJSON/Shapefiles

```bash
# Using ogr2ogr to import shapefiles
ogr2ogr -f "PostgreSQL" PG:"dbname=fra_atlas user=postgres" \
  -nln villages \
  -lco GEOMETRY_NAME=geom \
  -lco FID=id \
  data/villages.shp

# Import GeoJSON
ogr2ogr -f "PostgreSQL" PG:"dbname=fra_atlas user=postgres" \
  -nln fra_claims \
  -lco GEOMETRY_NAME=geom \
  data/claims.geojson
```

## Database Modes

The application supports two modes:

### Mock Data Mode (Default)
- Uses in-memory mock data
- No database required
- Good for development and testing
- Set `USE_DATABASE=false` in `.env.local`

### Database Mode
- Uses real PostGIS database
- Production-ready
- Supports large datasets
- Set `USE_DATABASE=true` in `.env.local`

## Common Tasks

### Backup Database

```bash
pg_dump -U postgres fra_atlas > backup_$(date +%Y%m%d).sql
```

### Restore Database

```bash
psql -U postgres fra_atlas < backup_20250129.sql
```

### Reset Database

```bash
# Drop and recreate
psql -U postgres -c "DROP DATABASE fra_atlas;"
psql -U postgres -c "CREATE DATABASE fra_atlas;"
psql -U postgres -d fra_atlas -f database/schema.sql
```

### View Database Statistics

```sql
-- Connect to database
psql -U postgres -d fra_atlas

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check record counts
SELECT 
    'states' as table_name, COUNT(*) as count FROM states
UNION ALL
SELECT 'districts', COUNT(*) FROM districts
UNION ALL
SELECT 'villages', COUNT(*) FROM villages
UNION ALL
SELECT 'fra_claims', COUNT(*) FROM fra_claims
UNION ALL
SELECT 'assets', COUNT(*) FROM assets;
```

## Troubleshooting

### Connection Refused

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list  # macOS

# Start PostgreSQL if not running
sudo systemctl start postgresql  # Linux
brew services start postgresql  # macOS
```

### Permission Denied

```bash
# Grant permissions
psql -U postgres -d fra_atlas
GRANT ALL PRIVILEGES ON DATABASE fra_atlas TO your_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
```

### PostGIS Extension Not Found

```bash
# Install PostGIS extension
sudo apt install postgresql-12-postgis-3  # Ubuntu/Debian
brew install postgis  # macOS
```

## Performance Optimization

### Create Additional Indexes

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_villages_water_vulnerability ON villages(water_vulnerability);
CREATE INDEX idx_fra_claims_claim_date ON fra_claims(claim_date);
CREATE INDEX idx_assets_asset_type ON assets(asset_type);
```

### Analyze Tables

```sql
-- Update statistics for query planner
ANALYZE villages;
ANALYZE fra_claims;
ANALYZE assets;
```

### Vacuum Database

```sql
-- Reclaim storage and update statistics
VACUUM ANALYZE;
```

## Next Steps

1. ✅ Database schema created
2. ✅ Connection utilities implemented
3. ⏳ Import your actual FRA data
4. ⏳ Configure environment variables
5. ⏳ Test API endpoints with real data
6. ⏳ Deploy to production

For more information, see the [Implementation Plan](../implementation_plan.md) and [Walkthrough](../walkthrough.md).
