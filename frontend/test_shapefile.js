const shapefile = require('shapefile');
const path = require('path');

const SHAPEFILE_BASE = 'C:\\B.Tech\\E-Forest\\india_shp_2020-master';
const filePrefix = 'India_District_23_MP';
const shpPath = path.join(SHAPEFILE_BASE, 'district', 'states', `${filePrefix}.shp`);
const dbfPath = path.join(SHAPEFILE_BASE, 'district', 'states', `${filePrefix}.dbf`);

console.log('Testing shapefile library...');
console.log('SHP Path:', shpPath);
console.log('DBF Path:', dbfPath);

shapefile.open(shpPath, dbfPath)
    .then(async (source) => {
        console.log('✓ Shapefile opened successfully');

        const features = [];
        let result = await source.read();
        let count = 0;

        while (!result.done && count < 5) {
            features.push(result.value);
            count++;
            result = await source.read();
        }

        console.log(`✓ Read ${features.length} features`);
        console.log('First feature properties:', features[0]?.properties);
        console.log('First feature geometry type:', features[0]?.geometry?.type);
    })
    .catch((error) => {
        console.error('✗ Error:', error.message);
        console.error('Stack:', error.stack);
    });
