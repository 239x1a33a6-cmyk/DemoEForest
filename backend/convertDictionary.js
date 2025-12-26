const fs = require('fs');
const path = require('path');

console.log('Starting CSV to JSON conversion...');

// Read the CSV file
const csvPath = path.join(__dirname, '..', 'public', 'English-Hindi Dictionary.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV and create dictionary
const lines = csvContent.split('\n');
const dictionary = {};
let successCount = 0;
let skipCount = 0;

// Skip header row
for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Match CSV pattern: "english","hindi","grammar"
    const match = line.match(/^"([^"]*)","([^"]*)"/);

    if (match && match[1] && match[2]) {
        const englishWord = match[1].toLowerCase().trim();
        const hindiWord = match[2].trim();

        // Only add if both words exist and English word not already in dictionary
        if (englishWord && hindiWord && !dictionary[englishWord]) {
            dictionary[englishWord] = hindiWord;
            successCount++;
        } else {
            skipCount++;
        }
    }
}

// Create dictionaries directory if it doesn't exist
const dictDir = path.join(__dirname, '..', 'public', 'dictionaries');
if (!fs.existsSync(dictDir)) {
    fs.mkdirSync(dictDir, { recursive: true });
}

// Write JSON file
const jsonPath = path.join(dictDir, 'english_hindi.json');
fs.writeFileSync(jsonPath, JSON.stringify(dictionary, null, 2), 'utf-8');

console.log('✅ Dictionary conversion complete!');
console.log(`   Total entries: ${successCount}`);
console.log(`   Skipped: ${skipCount}`);
console.log(`   Output: ${jsonPath}`);
