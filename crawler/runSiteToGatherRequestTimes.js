const puppeteer = require('puppeteer');
const fs = require('fs');

let url = process.argv[4].substr(1,process.argv[4].length);

let url_list = [];

let hasBrowserRun;

let startTime = 0;
let endTime = 0;
let timeToRegisterSW = {};

let requestTimes = {};

let arguments = [
    '--enable-features=NetworkService',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--ignore-certificate-errors',
    '--disable-gpu',
    '--preview',
    '--headless'
]

async function givePushPermissions(page, url){
    await page.goto(url);

    await page.evaluate(() => {
        if ("Notification" in window) {
            if (Notification.permission !== "granted") {
                Notification.requestPermission()
            }
        }
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe("running Sites For 3 Hours", () => {

    //starting process
    it("Leave " + url.split('/')[2] + " Run For 3 Hours", async() => {
        // Step 1: launch browser and take the page.
        hasBrowserRun = false;
        let count = 0;
        while(hasBrowserRun === false){
            try{
                var browser = await puppeteer.launch({
                    headless: false,
                    defaultViewport: {
                        width: 1500,
                        height: 1000,
                        isMobile: false
                    },
                    //executablePath: "./DefaultBrowser/chrome",
                    args: arguments
                });
                hasBrowserRun = true;
                console.log('Browser has started...');
            }catch(e){
                if(count == 5)
                    continue;
                await sleep(10000);
            }
            count += 1;
        }
        let pages =  await browser.pages();
        const page = pages[0];

        var swTargetFound = false;
        
        browser.on('targetcreated', async target => {
            if(target.type() === 'service_worker'){
                //saving time for registration
                endTime = Date.now()
                let SW_URL = target.url().split('?')[0]
                if(!(SW_URL in timeToRegisterSW))
                    timeToRegisterSW[SW_URL] = []
                timeToRegisterSW[SW_URL].push(endTime - startTime)

                //printing that a SW have been found
                console.log("Service Worker Found...")
                swTargetFound = true;

                //creating a CDP session to take SWs requests
                let CDPSW = (await target.createCDPSession());
                startTime = Date.now()
                await CDPSW.send('Network.enable');
                CDPSW.on('Network.requestWillBeSent', async requestToBeSent => {
                    endTime = Date.now()
                    requestTimes[JSON.stringify(requestToBeSent)] = endTime - startTime;
                    console.log("A request have been made...");
                    //console.log('request to: ' + requestToBeSent['request']['url']);
                });
                CDPSW.on('Network.responseReceived', async responseReceived => {
                    //console.log('responce from: ' + responseReceived['response']['url']);
                });
            }
        });

        page.setDefaultNavigationTimeout(90000);
        
        try{
            startTime = Date.now();
            await givePushPermissions(page, url);
            console.log("Permisions were given...");
        }catch(err){
            console.log("Failed to give permisions...");
            await browser.close();
            console.log('Browser closed...\n')
            return;
        }

        try{

            startTime = Date.now()
            await page.goto(url, {waitUntil: 'load'});
            console.log('Site loaded...')

            console.log('Waiting for 3 hours...');
            //await sleep(10800000);
            await sleep(60000)

            console.log('Finish waiting...')
        }catch(err){
            console.log(err)
            //just skipping
        }finally{
            await browser.close();
            console.log('Browser closed...\n')
        }
    })

    after(function(){
        if (!fs.existsSync('SW_info')){
            fs.mkdirSync('SW_info');
        }

        var file = fs.createWriteStream('SW_info/ThreeHoursLeave-' + url.split('/')[2] + '.txt');
        file.write("---------------Time to register SW-------------------\n");
        for(key in timeToRegisterSW){
            file.write("Time: " + timeToRegisterSW[key] + "ms, Request: " + key + "\n");
        }
        file.write("---------------Times of the requests-----------------\n");
        for(key in requestTimes){
            file.write("Time: " + requestTimes[key] + "ms, Request: " + key + "\n");
        }
        file.end();
        console.log("ThreeHoursLeave-" + url.split('/')[2] + ".txt was successfully created!\n");
    });
});