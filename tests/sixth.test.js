const puppeteer = require("puppeteer");
const scrape = require('website-scraper');

async function downloadSite(site){
    scrape({
        urls: [
            site
        ],
        directory: './Downloaded_sites/' + site.split('/')[2],
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
        console.log("Failed to download " + site.split('/')[2] + ".");
    });
}

describe("Just run the browser", () => {
    it("Should run the browser", async function(){
        //open the browser and a new page
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: {
                width: 1500,
                height: 1000
            },
            devtools: false
        });
        const context = browser.defaultBrowserContext();
        const pages = await browser.pages();
        const page = pages[0];

        page.setDefaultNavigationTimeout(150000);

        //add the puppeteer code
        await page.goto("https://www.youtube.com/", {waitUntil: 'load'});
        console.log(await page.url());
        await downloadSite(page.url());

        await page.goto("https://web.archive.org/web/20190514235927/https://www.youtube.com/", {waitUntil: 'load'});
        console.log(await page.url());
        await downloadSite(page.url());

        //close the browser
        await browser.close();
    })
})