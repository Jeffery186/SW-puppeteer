const puppeteer = require("puppeteer");
const scrape = require('website-scraper');
const fs = require('fs');

input_file = 'Datasets/serviceWorkersSite2.csv'
url_list = [];

async function downloadSite(site){
    await scrape({
        urls: [
            site
        ],
        directory: './Downloaded_sites/' + site.split('/')[2] + '-' + site.split('/')[7],
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
        // Outputs HTML 
        // console.log(result);
        console.log(site.split('/')[2] + " content succesfully downloaded.");
    }).catch(function (err) {
        console.log("Failed to download " + site.split('/')[7] + ".");
    });
}

describe("Just run the browser", () => {

    rawData = fs.readFileSync(input_file, {encoding: 'ascii'});
    rawDataList = rawData.split('\n');

    for(let j = 0; j < rawDataList.length; j++){
        data = rawDataList[j].split(',')[1];
        if(data === undefined)continue;
        if(data.search("http") !== -1)url_list.push('https://web.archive.org/web/20180101/' + data);
        else if(data.search("www") !== -1)url_list.push("https://web.archive.org/web/20180101/http://" + data);
        else url_list.push("https://web.archive.org/web/20180101/http://www." + data);
    }

    if(url_list.length > 0)console.log("File " + input_file.split('/')[1] + " was successfully read.");

    for(let i = 0; i < url_list.length; i++){
        it("Should scrape a site", async function(){
            //open the browser and a new page
            const browser = await puppeteer.launch({
                headless: false,
                defaultViewport: {
                    width: 1500,
                    height: 1000
                },
                devtools: false
            });
            const pages = await browser.pages();
            const page = pages[0];

            page.setDefaultNavigationTimeout(150000);

            //add the puppeteer code
            await page.goto(url_list[i], {waitUntil: 'load'});
            console.log(await page.url());
            await downloadSite(page.url());

            //close the browser
            await browser.close();
        })
    }
})