const puppeteer = require('puppeteer');
const fs = require('fs');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function openBrowser(){
    let browser = await puppeteer.launch({
        headless: false,
        devtools: true,
        defaultViewport:{
            height: 1200,
            width: 1900,
            isMobile: false
        },
        //executablePath: "C:/Users/george/Desktop/chrome-win/chrome.exe",
        //ignoreDefaultArgs: ["--disable-extensions"],
        //userDataDir: "./chromeProfile",
        args: [
            //"--proxy-server=http://127.0.0.1:8080",
            "--ignore-certificate-errors",
            "--ssl-version-min=tls1",
            "--ssl-version-max=tls1.3",
            "--tlsv1",
            "--tlsv1.1",
            "--tlsv1.2",
            "--tlsv1.3"
            //"--disable-web-security"
        ]
    });
    let context = await browser.defaultBrowserContext();
    let pages =  await browser.pages();
    let page = pages[0];

    browser.on("targetcreated", async sw => {
        if(sw.type() === 'service_worker'){
            //sw.on("request", async request =>{
            //    console.log(request.url());
            //});
            let CDPSW = (await sw.createCDPSession());
            await CDPSW.send('Network.enable');
            CDPSW.on('Network.requestWillBeSent', async requestToBeSent => {
                console.log('request to: ' + requestToBeSent['request']['url']);
            });
            CDPSW.on('Network.responseReceived', async responseReceived => {
                console.log('responce from: ' + responseReceived['response']['url']);
            });
        }
    });

    page.goto('https://www.hdfc.com/', {waitUntil: 'networkidle0'})

    sleep(5000);

}

openBrowser();