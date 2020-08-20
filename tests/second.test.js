'use strict'

const puppeteer = require('puppeteer');

//list of all the urls we want to check
let url_list = [
    "https://www.google.com/",
    "https://www.youtube.com/",
    "https://github.com/",
    "https://www.instagram.com/",
    "https://esmo.pro/play-2_1?h=waWQiOjEwMTYzODgsInNpZCI6MTAyMTc5Niwid2lkIjo4Njc1NCwic3JjIjoyfQ==eyJ&click_id=4e05649cc3263667374d2bd031e6bb1c-9964-0723"
]



describe("Checking for various sites", () => {
    for (let i = 0; i < url_list.length; i++){
        it("Checked " + url_list[i], async() => {

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
                await context.overridePermissions(url, ["notifications"])
                await page.goto(url)
                swTarget = await browser.waitForTarget(target => target.type() === 'service_worker', {
                    timeout: 20000
                });
            
                // Step 3a: If a service worker is registered, print URL of SW file to the console 
                if(swTarget) {
                    console.log(swTarget._targetInfo['url']);
                }
            }catch(err){
                // The process will timeout after 10s, if no service worker is registered
                console.log("No SW is registered");
            }

            // Step 4: Done. Close.
            await browser.close()
        })
    }
})