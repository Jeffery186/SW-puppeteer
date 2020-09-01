const puppeteer = require('puppeteer');
const fs = require('fs');
const random_useragent = require('random-useragent');

let input_file = 'Datasets/serviceWorkersSite.csv';
let permitions = true;

let url_list = [];
let ServiceWorkers = [];
let rawData;
let rawDataList;
let data;

describe("running the crawler", () => {

    rawData = fs.readFileSync(input_file, {encoding: 'ascii'});
    rawDataList = rawData.split('\n');

    for(let j = 0; j < rawDataList.length; j++){
        data = rawDataList[j].split(',')[1];
        if(data === undefined)continue;
        if(data.search("http") !== -1)url_list.push(data);
        else if(data.search("www") !== -1)url_list.push("http://" + data);
        else url_list.push("http://www." + data);
    }

    if(url_list.length > 0)console.log("File " + input_file.split('/')[1] + " was successfully read.");
    
    for (let i = 0; i < url_list.length; i++){
        it("("+ (i + 1) + "/" + url_list.length + ") Checked " + url_list[i].split('/')[2], async() => {

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
            
            browser.userAgent(random_useragent.getRandom());

            try {
                // Step 2: Go to a URL and wait for a service worker to register.
                if (permitions) await context.overridePermissions(url, ["notifications"]);
                await page.goto(url);
    
                if(await page.url()[4] !== 's') throw err;
    
                swTarget = await browser.waitForTarget(target => target.type() === 'service_worker', {
                    timeout: 25000
                });
            
                // Step 3a: If a service worker is registered, print URL of SW file to the console 
                if(swTarget) {
                    ServiceWorkers.push(swTarget._targetInfo['url']);
                }
            }catch(err){
                // The process will timeout after 15s, if no service worker is registered
            }
    
            // Step 4: Done. Close.
            await browser.close()
        })
    }

    after(function(){
        try{
            var file = fs.createWriteStream('ServiceWorkers.txt');
            ServiceWorkers.forEach(function(v) { file.write(v + '\n'); });
            file.end();
            console.log("\n\nServiceWorkers.cvs was successfully created!");
        }catch(err){
            console.log("\n\n");
            console.log(ServiceWorkers);
        }

        console.log("\n");
        console.log("\n");
        console.log("Statistics");
        console.log("=============================");
        console.log("\n");
        console.log("" + ServiceWorkers.length + "/" + url_list.length + " of sites registers a SW");
    })
})