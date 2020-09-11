const puppeteer = require("puppeteer");
const random_useragent = require('random-useragent');

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

        //add the puppeteer code
        await page.goto("http://www.google.com", {waitUntil: 'load'});
        console.log(await page.url());
        await page.waitFor(30000);

        //close the browser
        await browser.close();
    })
})