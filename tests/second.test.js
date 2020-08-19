const puppeteer = require('puppeteer');

describe("Just run the browser", () => {
    it("Should run the browser", async() => {
        try {
            // Step 1: launch browser and open a new page.
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
            
            let url_list = [
                "https://www.google.com/",
                "https://www.youtube.com/",
                "https://github.com/",
                "https://www.instagram.com/"
            ]

            for (let i = 0; i < url_list.length; i++){
                // Step 2: Go to a URL and wait for a service worker to register.
                url = url_list[i]
                await page.goto(url)
                const swTarget = await browser.waitForTarget(target => target.type() === 'service_worker',{
                    timeout: 5000
                })
            
                // Step 3a: If a service worker is registered, print URL of SW file to the console 
                if(swTarget) {
                    console.log(swTarget._targetInfo['url'])
                }
            }
            
            // Step 4: Done. Close.
            await browser.close()
        
            } catch (err) {
            // The process will timeout after 30s, if no service worker is registered
            console.error(err.message)
            }
    })
})