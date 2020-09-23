const puppeteer = require("puppeteer");

describe("Just run the browser", () => {
    it("Should scrape a site", async function(){
        //open the browser and a new page
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

        page.setDefaultNavigationTimeout(150000);

        //add the puppeteer code
        page.on('popup', async dialog => {
            console.log('here');
        });
        await page.goto('http://www.jpnn.com', {waitUntil: 'load'});
        console.log(await page.url());
        //await page.click("input[name='alert']")
        await page.waitFor(15000);

        //close the browser
        await browser.close();
    })
})