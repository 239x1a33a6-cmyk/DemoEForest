const shp = require('shpjs');
const fs = require('fs');
const path = require('path');

global.self = global;

const SHAPEFILE_BASE = 'C:\\B.Tech\\E-Forest\\india_shp_2020-master';
const OUTPUT_DIR = 'C:\\B.Tech\\E-Forest\\public\\geojson';

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const STATE_FILE_MAPPING = {
    'Madhya Pradesh': 'India_District_23_MP',
    'Jharkhand': 'India_District_20_JH',
    // Add more as needed
};

async function convertShapefiles() {
    for (const [stateName, filePrefix] of Object.entries(STATE_FILE_MAPPING)) {
        const shpPath = path.join(SHAPEFILE_BASE, 'district', 'states', `${filePrefix}.shp`);

        console.log(`Converting ${stateName}...`);

        try {
            const buffer = fs.readFileSync(shpPath);
            const geojson = await shp(buffer);

            const outputPath = path.join(OUTPUT_DIR, `${filePrefix}.geojson`);
            fs.writeFileSync(outputPath, JSON.stringify(geojson, null, 2));

            console.log(`✓ Converted ${stateName} to ${outputPath}`);
        } catch (error) {
            console.error(`✗ Error converting ${stateName}:`, error.message);
        }
    }
}

convertShapefiles().then(() => {
    console.log('Conversion complete!');
}).catch(err => {
    console.error('Conversion failed:', err);
});
