const fs = require('fs');
const path = require('path');
const shapefile = require('shapefile');

const SOURCE_DIR = path.join(__dirname, '../india_shp_2020-master/district/states');
const OUTPUT_DIR = path.join(__dirname, '../public/data/new_districts');

// Map of SHP filenames to State Names
const STATE_MAPPING = {
    'India_District_28_AP.shp': 'Andhra Pradesh',
    'India_District_36_TG.shp': 'Telangana',
    'India_District_23_MP.shp': 'Madhya Pradesh',
    'India_District_20_JH.shp': 'Jharkhand',
    'India_District_16_TR.shp': 'Tripura',
    'India_District_22_CT.shp': 'Chhattisgarh',
    'India_District_21_OR.shp': 'Orissa' // Using 'Orissa' to match existing code, though 'Odisha' is correct
};

async function convert() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    for (const [filename, stateName] of Object.entries(STATE_MAPPING)) {
        const shpPath = path.join(SOURCE_DIR, filename);
        const dbfPath = shpPath.replace('.shp', '.dbf');
        const outputPath = path.join(OUTPUT_DIR, `${stateName}.json`);

        console.log(`Converting ${stateName}...`);

        try {
            const geojson = await shapefile.read(shpPath, dbfPath);

            // Optional: Optimize or filter properties here if needed
            // For now, keeping it simple

            fs.writeFileSync(outputPath, JSON.stringify(geojson));
            console.log(`Saved to ${outputPath}`);
        } catch (error) {
            console.error(`Error converting ${stateName}:`, error);
        }
    }
}

convert();
