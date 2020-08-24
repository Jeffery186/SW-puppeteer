const puppeteer = require('puppeteer');
const csv = require('csv-parser');
const fs = require('fs');

//reading data test

var sites = [];

describe("Should read the data file", async () => {
    fs.createReadStream('Datasets/top-1000.csv')
    .pipe(csv())
    .on('data', (row) => {
        sites.push("http://www." + row.site);
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
        console.log(sites);
    });
})