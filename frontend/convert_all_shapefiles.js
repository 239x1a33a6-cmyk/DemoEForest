const shapefile = require('shapefile');
const fs = require('fs');
const path = require('path');

const SHAPEFILE_BASE = 'C:\\B.Tech\\E-Forest\\india_shp_2020-master';
const OUTPUT_DIR = 'C:\\B.Tech\\E-Forest\\public\\geojson\\states';

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const STATE_FILE_MAPPING = {
    'Jammu and Kashmir': 'India_District_01_JK',
    'Himachal Pradesh': 'India_District_02_HP',
    'Punjab': 'India_District_03_PB',
    'Chandigarh': 'India_District_04_CH',
    'Uttarakhand': 'India_District_05_UT',
    'Haryana': 'India_District_06_HR',
    'Delhi': 'India_District_07_DL',
    'Rajasthan': 'India_District_08_RJ',
    'Uttar Pradesh': 'India_District_09_UP',
    'Bihar': 'India_District_10_BR',
    'Sikkim': 'India_District_11_SK',
    'Arunachal Pradesh': 'India_District_12_AR',
    'Nagaland': 'India_District_13_NL',
    'Manipur': 'India_District_14_MN',
    'Mizoram': 'India_District_15_MZ',
    'Tripura': 'India_District_16_TR',
    'Meghalaya': 'India_District_17_ML',
    'Assam': 'India_District_18_AS',
    'West Bengal': 'India_District_19_WB',
    'Jharkhand': 'India_District_20_JH',
    'Odisha': 'India_District_21_OR',
    'Chhattisgarh': 'India_District_22_CT',
    'Madhya Pradesh': 'India_District_23_MP',
    'Gujarat': 'India_District_24_GJ',
    'Daman and Diu': 'India_District_25_DD',
    'Dadra and Nagar Haveli': 'India_District_26_DN',
    'Maharashtra': 'India_District_27_MH',
    'Andhra Pradesh': 'India_District_28_AP',
    'Karnataka': 'India_District_29_KA',
    'Goa': 'India_District_30_GA',
    'Lakshadweep': 'India_District_31_LD',
    'Kerala': 'India_District_32_KL',
    'Tamil Nadu': 'India_District_33_TN',
    'Puducherry': 'India_District_34_PY',
    'Andaman and Nicobar Islands': 'India_District_35_AN',
    'Telangana': 'India_District_36_TG',
    'Ladakh': 'India_District_37_LA'
};

async function convertShapefiles() {
    console.log('Starting shapefile to GeoJSON conversion...\n');

    for (const [stateName, filePrefix] of Object.entries(STATE_FILE_MAPPING)) {
        const shpPath = path.join(SHAPEFILE_BASE, 'district', 'states', `${filePrefix}.shp`);
        const dbfPath = path.join(SHAPEFILE_BASE, 'district', 'states', `${filePrefix}.dbf`);

        if (!fs.existsSync(shpPath)) {
            console.log(`⊘ Skipping ${stateName} - file not found`);
            continue;
        }

        try {
            const source = await shapefile.open(shpPath, dbfPath);
            const features = [];

            let result = await source.read();
            while (!result.done) {
                features.push(result.value);
                result = await source.read();
            }

            const geojson = {
                type: 'FeatureCollection',
                features: features
            };

            const outputPath = path.join(OUTPUT_DIR, `${filePrefix}.geojson`);
            fs.writeFileSync(outputPath, JSON.stringify(geojson));

            console.log(`✓ ${stateName}: ${features.length} districts → ${filePrefix}.geojson`);
        } catch (error) {
            console.error(`✗ Error converting ${stateName}:`, error.message);
        }
    }
}

convertShapefiles().then(() => {
    console.log('\n✓ Conversion complete!');
    console.log(`GeoJSON files saved to: ${OUTPUT_DIR}`);
}).catch(err => {
    console.error('\n✗ Conversion failed:', err);
});
