global.self = global;
const fs = require('fs');
const path = require('path');
const shp = require('shpjs');

const SHAPEFILE_BASE = 'C:\\B.Tech\\E-Forest\\india_shp_2020-master';
const TEST_FILE = 'India_District_20_JH'; // Jharkhand

async function testParsing() {
    const shpPath = path.join(SHAPEFILE_BASE, 'district', 'states', `${TEST_FILE}.shp`);
    const dbfPath = path.join(SHAPEFILE_BASE, 'district', 'states', `${TEST_FILE}.dbf`);

    console.log(`Reading files from: ${shpPath}`);

    if (!fs.existsSync(shpPath) || !fs.existsSync(dbfPath)) {
        console.error('Files not found!');
        return;
    }

    const shpBuffer = fs.readFileSync(shpPath);
    const dbfBuffer = fs.readFileSync(dbfPath);

    try {
        console.log('Parsing shapefile...');
        const shpData = shp.parseShp(shpBuffer);
        console.log('SHP parsed. Type:', Array.isArray(shpData) ? 'Array' : typeof shpData);

        const dbfData = shp.parseDbf(dbfBuffer);
        console.log('DBF parsed. Type:', Array.isArray(dbfData) ? 'Array' : typeof dbfData);

        const geojson = shp.combine([shpData, dbfData]);

        console.log('Parsing successful!');
        console.log('Type:', geojson.type);
        console.log('Number of features:', geojson.features.length);
        if (geojson.features.length > 0) {
            console.log('First feature properties:', JSON.stringify(geojson.features[0].properties, null, 2));
        }
    } catch (error) {
        console.error('Error parsing:', error);
    }
}

testParsing();
