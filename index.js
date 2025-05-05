/**
 * Analyzes e-commerce orders CSV to find:
 * - Record with highest total amount (after discount)
 * - Record with highest quantity
 * - Record with largest difference between full and discounted price
 * Usage: node script.js <path-to-csv>
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

if(process.argv.length < 3) {
    console.log('ERROR: Specify the path to the CSV file.')
    console.log('Usage: node script.js <path-to-csv>');
    process.exit(1);
}

const filePath = process.argv[2];

if(!fs.existsSync(filePath)) {
    console.log(`ERROR: File "${filePath}" does not exist`);
    process.exit(1);
}

if(path.extname(filePath).toLowerCase() !== '.csv') {
    console.log('ERROR: Only .csv files are supported');
    process.exit(1);
}

let maxTotal = { record: null, value: -Infinity };
let maxQuantity = { record: null, value: -Infinity };
let maxDiff = { record: null, value: -Infinity };

fs.createReadStream(filePath).pipe(csv()).on('data', (rawRow) => {
    try {
        const row = {};
        for (let key in rawRow) {
            const normalizedKey = key.trim().toLowerCase();
            row[normalizedKey] = rawRow[key];
        }

        const quantity = parseFloat(row['quantity']);
        const unitPrice = parseFloat(row['unit price']);
        const discount = parseFloat(row['percentage discount']);

        if (isNaN(quantity) || isNaN(unitPrice) || isNaN(discount)) {
            console.warn('Warning: Skipping row with invalid numeric values ', rawRow);
            return;
        }

        const totalNoDiscount = quantity * unitPrice;
        const totalDiscount = totalNoDiscount * (1 - discount / 100);
        const diff = totalNoDiscount - totalDiscount;

        if(totalDiscount > maxTotal.value) maxTotal = { record: rawRow, value: totalDiscount };
        if(quantity > maxQuantity.value) maxQuantity = { record: rawRow, value: quantity };
        if(diff > maxDiff.value) maxDiff = { record: rawRow, value: diff };
    }
    catch(error) {
        console.warn('Warning: Error processing row ', rawRow, error);
    }
})
.on('end', () => {
    console.log('\nRecord with highest total amount (after discount):');
    console.table(maxTotal.record);
    console.log('\nRecord with highest quantity:');
    console.table(maxQuantity.record);
    console.log('\nRecord with largest difference between full and discounted total:');
    console.table(maxDiff.record);
})
.on('error', (error) => {
    console.error('Error processing CSV:', error);
    process.exit(1);
});