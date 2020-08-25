const puppeteer = require('puppeteer');
const csv = require('csv-parser');
const fs = require('fs');
const { Console } = require('console');

let url_list = [];
let ServiceWorkers = [];
let rawData;
let rawDataList;
let Data;


describe("running the crawler", () => {

    rawData = fs.readFileSync('Datasets/top-10.csv', {encoding: 'ascii'});
    rawDataList = rawData.split('\n');

    for(let j = 0; j < rawDataList.length; j++){
        console.log(rawDataList[j]);
        if(!rawDataList[j])continue;
        url_list.push("http://www." + rawDataList[j].split(',')[1])
    }
    console.log(url_list);
    for (let i = 0; i < url_list.length; i++){
        it("("+ i + "/" + url_list.length + ") Checked " + url_list[i].split('/')[2], async() => {

            // Step 1: launch browser and take the page.
            let browser = await puppeteer.launch({
                headless: true,
                defaultViewport: {
                    width: 1500,
                    height: 1000
                },
                devtools: false
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
                    ServiceWorkers.push(swTarget._targetInfo['url']);
                }
            }catch(err){
                // The process will timeout after 20s, if no service worker is registered
            }
    
            // Step 4: Done. Close.
            await browser.close()
        })
    }

    after(function(){
        console.log('\n');
        console.log(ServiceWorkers);
    })
})