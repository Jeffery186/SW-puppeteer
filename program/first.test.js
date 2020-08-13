const puppeteer = require("puppeteer");
const random_useragent = require('random-useragent');

describe("Just run the browser", () => {
    it("Should run the browser", async function(){
        //open the browser and a new page
        const browser = await puppeteer.launch({
            headless: true,
            slowMo: 0,
            defaultViewport: {
                width: 1500,
                height: 1000
            },
            devtools: true
        });
        const context = browser.defaultBrowserContext();
        const pages = await browser.pages();
        const page = pages[0];

        //add the puppeteer code
        context.overridePermissions("https://esmo.pro/play-2_1?h=waWQiOjEwMTYzODgsInNpZCI6MTAyMTc5Niwid2lkIjo4Njc1NCwic3JjIjoyfQ==eyJ&click_id=4e05649cc3263667374d2bd031e6bb1c-9964-0723", ["notifications"])
        for(i = 0; i < 5; i++){
            await page.setUserAgent(random_useragent.getRandom());
            await page.goto("https://esmo.pro/play-2_1?h=waWQiOjEwMTYzODgsInNpZCI6MTAyMTc5Niwid2lkIjo4Njc1NCwic3JjIjoyfQ==eyJ&click_id=4e05649cc3263667374d2bd031e6bb1c-9964-0723");
            await page.waitFor(5000);
            console.log(await page.url());
        }
        await page.waitFor(3000);

        //close the browser
        await browser.close();
    })
})