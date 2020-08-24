const puppeteer = require('puppeteer');
const csv = require('csv-parser');
const fs = require('fs');

let url_list = [];

describe("running the crawler", () => {

    before(function(done) {
        fs.createReadStream('Datasets/top-1000.csv')
        .pipe(csv())
        .on('data', (row) => {
            url_list.push("http://www." + row.site);
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
            console.log(url_list);
            done();
        });
    })

    console.log(url_list.length);
    for(let i = 0; i < url_list.length; i++){

        it("("+ i + "/" + url_list.length + ") Checked " + url_list[i], async() => {
            // Step 1: launch browser and take the page.
            let browser = await puppeteer.launch({
                headless: true,
                defaultViewport: {
                    width: 1500,
                    height: 1000
                },
                devtools: false,
                dumpio: true,
                args: "--no-sandbox"
            });
            let context = browser.defaultBrowserContext();
            let pages =  await browser.pages();
            let page = pages[0];

            let url = url_list[i];

            var swTarget;

            try {
                // Step 2: Go to a URL and wait for a service worker to register.
                await page.goto(url);
                await context.overridePermissions(url, ["notifications"]);

                if(await page.url()[4] !== 's') throw err;

                swTarget = await browser.waitForTarget(target => target.type() === 'service_worker', {
                    timeout: 10000
                });
            
                // Step 3a: If a service worker is registered, print URL of SW file to the console 
                if(swTarget) {
                    console.log(swTarget._targetInfo['url']);
                }
            }catch(err){
                // The process will timeout after 20s, if no service worker is registered
                console.log("No SW is registered");
            }

            // Step 4: Done. Close.
            await browser.close()
        })
    }
})