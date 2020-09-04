const puppeteer = require('puppeteer');

let url_list = [
    "https://www.google.com/",
    "http://www.youtube.com/",
    "https://github.com/",
    "http://h2020.myspecies.info",
    "http://www.instagram.com/",
    "https://esmo.pro/play-2_1?h=waWQiOjEwMTYzODgsInNpZCI6MTAyMTc5Niwid2lkIjo4Njc1NCwic3JjIjoyfQ==eyJ&click_id=4e05649cc3263667374d2bd031e6bb1c-9964-0723",
    "https://www.google.com/maps",
    "https://dev.to/"
]

let serviceWorkers = [];

describe("Just run the browser", () => {
    it("Should run the browser", async function(){
        //open the browser and a new page
        for(let i = 0; i < url_list.length; i++){
            const browser = await puppeteer.launch({
                headless: true,
                defaultViewport: {
                    width: 1500,
                    height: 1000,
                    //isMobile:false
                },
                devtools: false
            });
            const context = browser.defaultBrowserContext();
            const pages = await browser.pages();
            const page = pages[0];

            browser.on('serviceworkercreated', async sw => {
                serviceWorkers.push(sw.url());
            });

            await page.goto(url_list[i], {waitUntil: "load"});
            try{
                await page.evaluate('navigator.serviceWorker.ready').then( sw => {
                    console.log(sw);
                });
            }catch{

            }
            console.log(await page.url());
            console.log(await browser.serviceWorkers);

            //close the browser
            await browser.close();
        }

        console.log(serviceWorkers);
    })
})