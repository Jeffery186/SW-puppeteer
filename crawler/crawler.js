const puppeteer = require('puppeteer');
const fs = require('fs');

let url_list = [];
let ServiceWorkers = [];
let rawData;
let rawDataList;
let input_file = 'Datasets/top-10.csv';
let data;

describe("running the crawler", () => {

    process.argv.forEach(function (val, index, array) {
        console.log(index + ': ' + val);
    });

    rawData = fs.readFileSync(input_file, {encoding: 'ascii'});
    rawDataList = rawData.split('\n');

    for(let j = 0; j < rawDataList.length; j++){
        data = rawDataList[j].split(',')[1];
        if(data === undefined)continue;
        url_list.push("http://www." + data);
    }

    if(url_list.length > 0)console.log("File " + input_file.split('/')[1] + " was successfully read.");
    
    for (let i = 0; i < url_list.length; i++){
        it("("+ (i + 1) + "/" + url_list.length + ") Checked " + url_list[i].split('/')[2], async() => {
            for(let reloadLoop = 0; reloadLoop < 3; reloadLoop++){
                // Step 1: launch browser and take the page.
                let browser = await puppeteer.launch({
                    headless: true,
                    defaultViewport: {
                        width: 1500,
                        height: 1000,
                        isMobile: false
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
                        timeout: 15000
                    });
                
                    // Step 3a: If a service worker is registered, print URL of SW file to the console 
                    if(swTarget) {
                        ServiceWorkers.push(swTarget._targetInfo['url']);
                    }
                }catch(err){
                    // The process will timeout after 15s, if no service worker is registered
                }
        
                // Step 4: Done. Close.
                await browser.close();
            }
        })
    }

    after(function(){
        var file = fs.createWriteStream('ServiceWorkers.cvs');
        ServiceWorkers.forEach(function(v) { file.write(v + ', \n'); });
        file.end();
        console.log("ServiceWorkers.cvs was successfully created!");
    })
})