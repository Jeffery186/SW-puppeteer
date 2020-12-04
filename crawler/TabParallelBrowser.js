const puppeteer = require('puppeteer');
const fs = require('fs');

let maxTabs = 20;
let browser;
let context;
let sites = [];
let sitesPart = [];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function readSites(){
    let input_file = process.argv[2].substr(1,process.argv[2].length);

    rawData = fs.readFileSync(input_file, {encoding: 'ascii'});
    rawDataList = rawData.split('\n');

    if(rawDataList[rawDataList.length - 1] === '')
        rawDataList.pop();

    for(let j = 0; j < rawDataList.length; j++){
        data = rawDataList[j];
        if(data === undefined)continue;
        if(data.search("http") !== -1)sites.push(data);
        else if(data.search("www") !== -1)sites.push("http://" + data);
        else sites.push("http://www." + data);
    }

    if(sites.length > 0)
        console.log("File " + input_file + " was successfully read.");
}

function splitSites(){
    let partSize = Math.ceil(sites.length / maxTabs);
    let temp = [];

    sites.forEach(site => {
        temp.push(site);

        if (temp.length === partSize){
            sitesPart.push([...temp]);
            temp = [];
        }
    });
    
    if(temp.length !== 0)
        sitesPart.push(temp);

}

async function TabController(number){
    let page = await browser.newPage();

    sitesOfInterest = sitesPart[number]

    for(let i = 0; i < sitesOfInterest.length; i++){
        site = sitesOfInterest[i];
        await context.overridePermissions(site, ['notifications']);
        await page.setDefaultNavigationTimeout(90000);
        await page.goto(site, {waitUntil: 'load'})
        await sleep(120000)
    }

    console.log("TabController-" + number + " has finnished!");
    page.close();
}

async function Main(){
    browser = await puppeteer.launch({
        headless: false,
        defaultViewport:{
            height: 1200,
            width: 1200,
            isMobile: false
        },
        //executablePath: "C:/Users/george/Desktop/chrome-win/chrome.exe",
        args: [
            //"--proxy-server=http://127.0.0.1:8080",
            "--ignore-certificate-errors",
            "--ssl-version-min=tls1",
            "--ssl-version-max=tls1.3",
            "--tlsv1",
            "--tlsv1.1",
            "--tlsv1.2",
            "--tlsv1.3",
            "--user-data-dir=./chromeProfile",
            "--headless"
        ]
    });

    context = await browser.defaultBrowserContext();
    
    await readSites();
    await splitSites();

    for(let i = 0; i < maxTabs < sitesPart.length ? maxTabs : sitesPart.length; i++){
        TabController(i);
    }
}

Main()