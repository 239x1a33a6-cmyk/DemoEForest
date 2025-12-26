const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const SOURCE_DIR = path.join(__dirname, 'data');
const DEST_DIR = path.join(__dirname, '../frontend/public/DashboarDataset');

// Ensure destination directory exists
if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
}

// 1. Copy existing CSVs
const csvFiles = ['fra_state_claims_2024.csv', 'fra_state_status_2022.csv'];
csvFiles.forEach(file => {
    const src = path.join(SOURCE_DIR, file);
    const dest = path.join(DEST_DIR, file);
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`Copied ${file}`);
    } else {
        console.warn(`Warning: ${file} not found in source.`);
    }
});

// 2. Convert XLS to CSV
const xlsFile = 'tribal_population_2011.xls';
const xlsPath = path.join(SOURCE_DIR, xlsFile);
if (fs.existsSync(xlsPath)) {
    const workbook = XLSX.readFile(xlsPath);
    const sheetName = workbook.SheetNames[0];
    const csvContent = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
    fs.writeFileSync(path.join(DEST_DIR, 'tribal_population_2011.csv'), csvContent);
    console.log(`Converted ${xlsFile} to CSV`);
} else {
    console.warn(`Warning: ${xlsFile} not found.`);
}

// 3. Generate Mock Trend Data (since fra_state_trend.csv is missing)
const trendFile = 'fra_state_trend.csv';
const trendPath = path.join(DEST_DIR, trendFile);
if (!fs.existsSync(trendPath)) {
    const states = ['Telangana', 'Madhya Pradesh', 'Jharkhand', 'Odisha', 'Tripura'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let csv = 'State,Month,Year,Titles_Issued\n';

    states.forEach(state => {
        let cumulative = 0;
        // 2023 Data
        months.forEach(month => {
            const newTitles = Math.floor(Math.random() * 500) + 100;
            cumulative += newTitles;
            csv += `${state},${month},2023,${cumulative}\n`;
        });
        // 2024 Data (upto June)
        for (let i = 0; i < 6; i++) {
            const newTitles = Math.floor(Math.random() * 500) + 100;
            cumulative += newTitles;
            csv += `${state},${months[i]},2024,${cumulative}\n`;
        }
    });

    fs.writeFileSync(trendPath, csv);
    console.log(`Generated mock ${trendFile}`);
} else {
    console.log(`${trendFile} already exists.`);
}
