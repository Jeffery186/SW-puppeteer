const puppeteer = require('puppeteer');

let arguments_1 = [
    '--enable-features=NetworkService',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--ignore-certificate-errors',
    '--disable-gpu',
    //'--headless'
]
let timerStart = 0;
let timerEnd = 0;

var browser;
let found = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

describe("Just ask for notifications", () => {
    it("Should ask for notifications", async function(){
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: {
                width: 1500,
                height: 1000,
                isMobile: false
            },
            args: arguments_1
        });
        
        browser.on('targetcreated', (target => {
            if(target.type() === 'service_worker'){
                timerEnd = Date.now();
                console.log( 
                    'timer Start: ' + timerStart + '\n' +
                    'timer End: ' + timerEnd + '\n' +
                    'difference: ' + (timerEnd - timerStart)
                );
                found = true;
            }
        }))

        let pages =  await browser.pages();
        const page = pages[0];
        
        timerStart = Date.now();
        await givePushPermissions(page, "https://www.youtube.com")

        if (!found){
            await sleep(5000)

            timerStart = Date.now();
            await page.goto("https://www.youtube.com");
        }
    })

    after(function(){
        browser.close();
    })
})