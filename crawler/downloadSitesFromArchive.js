const scrape = require('website-scraper');
const fs = require('fs');
const colors = require('colors');

let maxParalism = 10;
let paralismCounter = 0;

let failedUrls = [];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadSite(site){
    paralismCounter++;
    console.log('Attemping dowloading ' + site + '...')
    await scrape({
        urls: [
            site
        ],
        directory: './Downloaded_sites/' + site.split('/')[7].split(':')[0] + '-archive',
        prettifyUrls: true,
        subdirectories: [
            {
                directory: 'img',
                extensions: ['.jpg', '.png', '.svg', '.webp', '.gif']
            },
            {
                directory: 'js',
                extensions: ['.js']
            },
            {
                directory: 'css',
                extensions: ['.css']
            },
            {
                directory: 'php',
                extensions: ['.php']
            },
            {
                directory: 'fonts',
                extensions: ['.woff', '.ttf', '.woff2', '.eot']
            }
        ]
    }).then(function (result) {
        console.log(site.split('/')[7] + " content " + "succesfully downloaded.".green);
        paralismCounter--;
    }).catch(function (err) {
        console.log("Failed".red + " to download " + site.split('/')[7] + " due to \n" + err);
        failedUrls.push(site)
        paralismCounter--;
    });
    console.log('Returing from ' + site + '...')
    return;
}

async function main(){
    sourceFile = process.argv[2].substr(1,process.argv[2].length);

    rawData = fs.readFileSync(sourceFile, {encoding: 'ascii'});
    serviceWorkerArchiveUrls = rawData.split('\n');

    if(serviceWorkerArchiveUrls[serviceWorkerArchiveUrls.length - 1] === '')serviceWorkerArchiveUrls.pop();

    serviceWorkerArchiveUrls = serviceWorkerArchiveUrls.map((item) => {
        return item.slice(0, -1)
    })

    testUrls = serviceWorkerArchiveUrls.slice(626,800)

    for(site in testUrls){
        while(paralismCounter >= maxParalism)
            await sleep(10000)
        downloadSite(testUrls[site])
    }
    
    console.log('\n\nlist of failed sites:\n')

    failedUrls.forEach((site) => {
        console.log(site)
    })
}

main()