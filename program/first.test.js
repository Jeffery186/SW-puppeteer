const puppeteer = require("puppeteer");

describe("Just run the browser", () => {
    it("Should run the browser", async function(){
        //open the browser and a new page
        const browser = await puppeteer.launch({
            headless: false,
            slowMo: 0
        });
        const pages = await browser.pages();
        const page = pages[0];

        //add the puppeteer code
        await page.goto("https://www.google.com/");
        await page.type(".gLFyf", "gravity");
        await page.keyboard.press("Enter", {delay: 10});
        await page.waitForNavigation();
        await page.$$eval('a h3', a => a[0].click());
        console.log(await page.url());
        await page.goto("https://www.google.com/");
        await page.type(".gLFyf", "Space");
        await page.keyboard.press("Enter", {delay: 10});
        await page.waitForNavigation();
        await page.$$eval('a h3', a => a[0].url());
        console.log(await page.url());
        await page.waitFor(3000);

        //close the browser
        await browser.close();
    })
})