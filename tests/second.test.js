'use strict'

const puppeteer = require('puppeteer');

let url_list = [
    "https://www.google.com/",
    "https://www.youtube.com/",
    "https://github.com/",
    "https://www.instagram.com/"
]



describe("Running for various sites", () => {
    for (let i = 0; i < url_list.length; i++){
        it("Checking " + url_list[i], async() => {

            // Step 1: launch browser and take the page.
            let browser = await puppeteer.launch({
                headless: true,
                defaultViewport: {
                    width: 1500,
                    height: 1000
                },
                devtools: false
            });
            let pages =  await browser.pages();
            let page = pages[0];

            var swTarget;
            var url;
            try {
                // Step 2: Go to a URL and wait for a service worker to register.
                url = url_list[i]
                await page.goto(url)
                swTarget = await browser.waitForTarget(target => target.type() === 'service_worker', {
                    timeout: 10000
                });
            
                // Step 3a: If a service worker is registered, print URL of SW file to the console 
                if(swTarget) {
                    console.log(swTarget._targetInfo['url']);
                }
            }catch(err){
                // The process will timeout after 30s, if no service worker is registered
                console.error(err.message);
            }

            // Step 4: Done. Close.
            await browser.close()
        })
    }
})