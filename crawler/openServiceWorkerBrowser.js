const puppeteer = require('puppeteer');
const fs = require('fs');

let browser;
let page;
let sites = [];
let domainsSWVisits = [];
let SWRegisted = false;

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
        data = data.split('?')[0];
        if(data.search("http") !== -1)sites.push(data);
        else if(data.search("www") !== -1)sites.push("http://" + data);
        else sites.push("http://www." + data);
    }

    if(sites.length > 0)
        console.log("File " + input_file + " was successfully read.");
}

async function writeOutputFile(name){
    let outputFile = fs.createWriteStream('connection_results/' + name.split('/')[2] + '()' + name.split('/')[3].split('.')[0] + '.txt');
    for( let j = 0; j < domainsSWVisits.length; j++){
        outputFile.write(domainsSWVisits[j] + '\n');
    }
    outputFile.close();
    domainsSWVisits = [];
}

async function openBrowser(site){
    browser = await puppeteer.launch({
        headless: false,
        devtools: true,
        defaultViewport:{
            height: 1200,
            width: 1900,
            isMobile: false
        },
        args: [
            "--ignore-certificate-errors",
            "--ssl-version-min=tls1",
            "--ssl-version-max=tls1.3",
            "--tlsv1",
            "--tlsv1.1",
            "--tlsv1.2",
            "--tlsv1.3",
            "--headless"
        ]
    });
    let context = await browser.defaultBrowserContext();
    let pages =  await browser.pages();
    page = pages[0];

    await context.overridePermissions(site, ['notifications']);
    await page.setDefaultNavigationTimeout(90000);

    browser.on("targetcreated", async sw => {
        if(sw.type() === 'service_worker'){
            console.log("Service Worker Registered");
            SWRegisted = true;
            let CDPSW = (await sw.createCDPSession());
            await CDPSW.send('Network.enable');
            CDPSW.on('Network.requestWillBeSent', async requestToBeSent => {
                //console.log('request to: ' + requestToBeSent['request']['url']);
                let domain = requestToBeSent['request']['url'].split('/')[2];
                if (domainsSWVisits.indexOf(domain) === -1){
                    domainsSWVisits.push(domain);
                }
            });
            CDPSW.on('Network.responseReceived', async responseReceived => {
                //console.log('responce from: ' + responseReceived['response']['url']);
            });
        }
    });
}

async function main(){
    let counter = 0;

    await readSites();

    for(let i = 0; i < sites.length; i++){
        counter = 0;
        SWRegisted = false;
        await openBrowser(sites[i]);
        while (counter < 2){
            try{
                await page.goto(sites[i], {waitUntil: 'load'});
                await sleep(10000);
                if(SWRegisted)
                    await writeOutputFile(sites[i]);
                break;
            }catch(e){
                counter++;
                if(counter === 2)
                    console.log("Failed load site " + sites[i]);
            }
        }
        await browser.close();
        console.log("Finished with site " + sites[i] + " (" + (i + 1) + " out of " + sites.length + ").");
    }
}

main();