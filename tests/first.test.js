const puppeteer = require("puppeteer");
const random_useragent = require('random-useragent');

describe("Just run the browser", () => {
    it("Should run the browser", async function(){
        //open the browser and a new page
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: {
                width: 1500,
                height: 1000
            },
            devtools: false
        });
        const context = browser.defaultBrowserContext();
        const pages = await browser.pages();
        const page = pages[0];

        browser.userAgent(random_useragent.getRandom());

        //add the puppeteer code
        await page.goto("http://www.google.com");
        await page.waitFor(3000);
        await page.waitForSelector(".gLFyf");
        await page.type(".gLFyf", "hello world", {delay: 150});
        await page.keyboard.press("Enter");
        await page.waitFor(3000);
        console.log(await page.url());

        await page.goto("http://gamato-movies.gr/hackers-1995-greek-subs-online/");
        await page.waitFor(3000);
        console.log(await page.url());

        await page.goto("http://www.facebook.com/");
        await page.waitFor(3000);
        console.log(await page.url());

        await page.goto("http://openvpn.net/community-downloads/");
        await page.waitFor(3000);
        console.log(await page.url());

        //close the browser
        await browser.close();
    })
})