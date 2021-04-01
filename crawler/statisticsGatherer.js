const puppeteer = require('puppeteer');
const fs = require('fs');

let input_file = process.argv[4].substr(1,process.argv[4].length);
let crawlerNumber = process.argv[5].substr(1,process.argv[5].length);

let numberOfLoops = 10;

let url_list = [];
let noServiceWorkers = [];

let hasBrowserRun;

let startTime = 0;
let endTime = 0;
let timeToRegisterSW = {};
let timeForFirstContact = {};
let firstContact = {};

var connectionOutputFile;
var SWRequestOutputFile;
var browserRequestOutputFile;

let swRequests = []
let browserRequestsDomains = []

let arguments = [
    '--enable-features=NetworkService',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--ignore-certificate-errors',
    '--disable-gpu',
    '--preview',
    '--headless'
]

async function givePushPermissions(page, url){
    await page.goto(url);

    await page.evaluate(() => {
        if ("Notification" in window) {
            if (Notification.permission !== "granted") {
                Notification.requestPermission()
            }
        }
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe("running Information Gatherer", () => {
    //reading data
    let rawData = fs.readFileSync(input_file, {encoding: 'ascii'});
    let rawDataList = rawData.split('\n');

    for(let j = 0; j < rawDataList.length; j++){
        let data = rawDataList[j].split(',')[0];
        if(data === undefined)continue;
        if(data.search("http") !== -1)
            url_list.push(data);
        else if(data.search("www") !== -1)
            url_list.push("http://" + data);
        else 
            if(data !== "")
                url_list.push("http://www." + data);
    }

    if(url_list.length > 0)console.log("File " + input_file.split('/')[1] + " was successfully read.");

    //starting process
    for (let i = 0; i < url_list.length; i++){
        it("("+ (i + 1) + "/" + url_list.length + ") Gathered info for " + url_list[i].split('/')[2], async() => {
            for(let reloadLoop = 0; reloadLoop < numberOfLoops; reloadLoop++){
                console.log('loop #' + (reloadLoop + 1))

                // Step 1: launch browser and take the page.
                hasBrowserRun = false;
                let count = 0;
                while(hasBrowserRun === false){
                    try{
                        var browser = await puppeteer.launch({
                            headless: false,
                            defaultViewport: {
                                width: 1500,
                                height: 1000,
                                isMobile: false
                            },
                            //executablePath: "./DefaultBrowser/chrome",
                            args: arguments
                        });
                        hasBrowserRun = true;
                        console.log('Browser has started...');
                    }catch(e){
                        if(count == 5)
                            continue;
                        await sleep(10000);
                    }
                    count += 1;
                }
                let pages =  await browser.pages();
                const page = pages[0];
        
                let url = url_list[i];

                var swTargetFound = false;
                
                browser.on('targetcreated', async target => {
                    if(target.type() === 'service_worker'){
                        //saving time for registration
                        endTime = Date.now()
                        let SW_URL = target.url().split('?')[0]
                        if(!(SW_URL in timeToRegisterSW))
                            timeToRegisterSW[SW_URL] = []
                        timeToRegisterSW[SW_URL].push(endTime - startTime)

                        //printing that a SW have been found
                        swTargetFound = true;

                        //creating a CDP session to take SWs requests
                        firstContact[SW_URL] = false;
                        let CDPSW = (await target.createCDPSession());
                        startTime = Date.now()
                        await CDPSW.send('Network.enable');
                        CDPSW.on('Network.requestWillBeSent', async requestToBeSent => {
                            endTime = Date.now()
                            let SW_URL_local = target.url().split('?')[0];
                            if(!firstContact[SW_URL_local]){
                                if(!(SW_URL_local in timeForFirstContact))
                                    timeForFirstContact[SW_URL_local] = [];
                                timeForFirstContact[SW_URL_local].push(endTime - startTime)
                                firstContact[SW_URL_local] = true
                            }
                            if(reloadLoop === 0){
                                swRequests.push(requestToBeSent);
                            }
                            //console.log('request to: ' + requestToBeSent['request']['url']);
                        });
                        CDPSW.on('Network.responseReceived', async responseReceived => {
                            //console.log('responce from: ' + responseReceived['response']['url']);
                        });
                    }
                });

                page.on('request', async request => {
                    browserRequestsDomains.push(request['_url'].split('/')[2] + '\n');
                });

                page.setDefaultNavigationTimeout(90000);

                try{
                    startTime = Date.now();
                    await givePushPermissions(page, url);

                    /*
                    if(swTargetFound){
                        //await downloadSite(page.url());
                        await browser.close();
                        continue;
                    }
                    */

                    startTime = Date.now()
                    await page.goto(url, {waitUntil: 'load'});
                    console.log('Site loaded...')

                    if(reloadLoop === 0){
                        //In the first loop we also gather the requests so
                        //leave it 3 minutes
                        console.log('Waiting for 3 mins...');
                        await sleep(180000);
                    }else if (swRequests.length === 0) {
                        //If there are no requests  in the first 3 mins we
                        //just wait 5s for any more SWs to be registered
                        console.log('Waiting for 5 secs...');
                        await sleep(5000);
                    }else{
                        //On the rest of the loops we are only interesting
                        //in the times so we check and if all the first
                        //contacts have been made we continue
                        console.log('Waiting for first contact...');
                        let moveOn = false;
                        let count = 0;
                        while((!moveOn) && (count < 12)){
                            await sleep(5000);
                            moveOn = true;
                            for(key in firstContact){
                                moveOn = moveOn && firstContact[key];
                            }
                            count += 1;
                        }
                    }

                    console.log('Info gathered...')

                    if(!swTargetFound && reloadLoop === 9){
                        noServiceWorkers.push(url);
                    }
                }catch(err){
                    //just skipping
                }finally{
                    await browser.close();
                    console.log('Browser closed...\n')
                }
            }

            if(swRequests.length > 0){
                connectionOutputFile = fs.createWriteStream('connection_results/' + url_list[i].split('/')[2] + '.txt');
                SWRequestOutputFile = fs.createWriteStream('SW_info/SWFullRequests/' + url_list[i].split('/')[2] + '.txt');
                browserRequestOutputFile = fs.createWriteStream('SW_info/browserFullRequests/' + url_list[i].split('/')[2] + '.txt');

                let swReqiestsDomains = [];

                swRequests.forEach((element) => {
                    swReqiestsDomains.push(element['request']['url'].split('/')[2] + '\n');
                    SWRequestOutputFile.write(JSON.stringify(element) + '\n');
                });

                swReqiestsDomains = swReqiestsDomains.filter(function(item, pos) {
                    return swReqiestsDomains.indexOf(item) === pos;
                });

                swReqiestsDomains.forEach((element) => {
                    connectionOutputFile.write(element);
                });

                browserRequestsDomains = browserRequestsDomains.filter(function(item, pos) {
                    return browserRequestsDomains.indexOf(item) === pos;
                });

                browserRequestsDomains.forEach((element => {
                    browserRequestOutputFile.write(element);
                }));

                connectionOutputFile.close();
                SWRequestOutputFile.close();
                browserRequestOutputFile.close();

                console.log('Files Successfully Created!');

                swRequests = [];
                browserRequestsDomains = [];
            }

            firstContact = {}
        })
    }

    after(function(){
        var file = fs.createWriteStream('SW_info/SW-info-part' + crawlerNumber + '.txt');
        for(key in timeToRegisterSW){
            let medianTimeToRegisterSW = -1
            let medianFirstContract = -1;
            let timeToRegisterSWValues = '-1'
            let timeForFirstContactValues = '-1'

            if(key in timeToRegisterSW){
                medianTimeToRegisterSW = (timeToRegisterSW[key].reduce((a,b) => a + b) / timeToRegisterSW[key].length);
            }

            if(key in timeForFirstContact){
                medianFirstContract = (timeForFirstContact[key].reduce((a,b) => a + b) / timeForFirstContact[key].length);
            }

            if(key in timeToRegisterSW){
                timeToRegisterSWValues = timeToRegisterSW[key].join(',');
            }

            if(key in timeForFirstContact){
                timeForFirstContactValues = timeForFirstContact[key].join(',');
            }

            file.write(
                key + ' ' + 
                medianTimeToRegisterSW + ' ' +
                medianFirstContract + ' ' +
                timeToRegisterSWValues + ' ' +
                timeForFirstContactValues + '\n'
            );
        }
        file.end();
        console.log("SW-info.txt was successfully created!\n");

        var file = fs.createWriteStream('SW_info/NoSWSites-part' + crawlerNumber + '.txt');
        noServiceWorkers.forEach((element) => {
            file.write(element + '\n');
        })
        file.end();
        console.log("NoSWSites.txt was successfully created!\n");
    });
});