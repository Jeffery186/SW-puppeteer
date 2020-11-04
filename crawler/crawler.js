const puppeteer = require('puppeteer');
const fs = require('fs');
const scrape = require('website-scraper');
const randomAgent = require('random-useragent')

let input_file = process.argv[4].substr(1,process.argv[4].length);
let crawlerNumber = process.argv[5].substr(1,process.argv[5].length);
let permitions = true;

let url_list = [];
let ServiceWorkers = [];
let noServiceWorkers = [];
let ServiceworkersSites = [];
let SitesThatRegisterServiceWorkersCount = 0;
let rawData;
let rawDataList;
let data;
let timeout = true;
let hasBrowserRun;
let arguments = [
    '--enable-features=NetworkService',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--ignore-certificate-errors',
    '--disable-gpu',
    '--headless'
]

async function downloadSite(site){
    scrape({
        urls: [
            site
        ],
        directory: './Downloaded_sites/' + site.split('/')[2],
        prettifyUrls: true,
        subdirectories: [
            {
                directory: 'img',
                extensions: ['.jpg', '.png', '.svg', '.webp', '.gif']
            },
            {
                directory: 'js',
                extensions: ['.js']
            },
            {
                directory: 'css',
                extensions: ['.css']
            },
            {
                directory: 'php',
                extensions: ['.php']
            },
            {
                directory: 'fonts',
                extensions: ['.woff', '.ttf', '.woff2', '.eot']
            }
        ]
    }).then(function (result) {
        console.log(site.split('/')[2] + " content succesfully downloaded.");
    }).catch(function (err) {
        console.log("Failed to download " + site.split('/')[2] + ".");
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe("running the crawler", () => {

    rawData = fs.readFileSync(input_file, {encoding: 'ascii'});
    rawDataList = rawData.split('\n');

    for(let j = 0; j < rawDataList.length; j++){
        data = rawDataList[j].split(',')[1];
        if(data === undefined)continue;
        if(data.search("http") !== -1)url_list.push(data);
        else if(data.search("www") !== -1)url_list.push("http://" + data);
        else url_list.push("http://www." + data);
    }

    if(url_list.length > 0)console.log("File " + input_file.split('/')[1] + " was successfully read.");
    
    //url_list = ['https://movie2k.life']
    //url_list = ['https://zip-hudhomes.com/', 'https://zip-foreclosures.com/', 'https://www.hdfc.com/', 'https://zestradar.com/']

    for (let i = 0; i < url_list.length; i++){
        it("("+ (i + 1) + "/" + url_list.length + ") Checked " + url_list[i].split('/')[2], async() => {
            for(let reloadLoop = 0; reloadLoop < 2; reloadLoop++){
                console.log("Loop number #" + (reloadLoop + 1));

                // Step 1: launch browser and take the page.
                hasBrowserRun = false;
                while(hasBrowserRun === false){
                    try{
                        var browser = await puppeteer.launch({
                            headless: false,
                            defaultViewport: {
                                width: 1500,
                                height: 1000,
                                isMobile: false
                            },
                            //executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
                            args: arguments
                        });
                        hasBrowserRun = true;
                    }catch(e){
                        await sleep(10000);
                    }
                }
                let context = browser.defaultBrowserContext();
                let pages =  await browser.pages();
                const page = pages[0];
        
                let url = url_list[i];

                var swTargetFound = false;
                
                browser.on('targetcreated', target => {
                    if(target.type() === 'service_worker'){
                        console.log(target.type());
                        console.log(target.url());
                        ServiceWorkers.push(target.url());
                        swTargetFound = true;
                    }
                });

                page.setDefaultNavigationTimeout(90000);
                if (permitions) await context.overridePermissions(url, ['notifications']);

                try{

                    await page.goto(url, {waitUntil: 'load'});
                    timeout = false;

                    await sleep(5000);

                    if(swTargetFound){
                        await downloadSite(page.url());
                        await ServiceworkersSites.push(page.url());
                        SitesThatRegisterServiceWorkersCount++;
                        await browser.close();
                        break;
                    }else{
                        throw err;
                    }
                }catch(err){
                    try{
                        if(timeout){
                            browser.close();
                            break;
                        }

                        await page.goto(url);
        
                        await sleep(25000);

                        if(swTargetFound){
                            await downloadSite(page.url());
                            await ServiceworkersSites.push(page.url());
                            SitesThatRegisterServiceWorkersCount++;
                            await browser.close();
                            break;
                        }else{
                            throw err;
                        }
                    }catch(err){
                        if(reloadLoop === 1){
                            await browser.close();
                            noServiceWorkers.push(url);
                        }
                    }
                }finally{
                    await browser.close();
                }
            }
        })
    }

    after(function(){
        let writeLoop
        try{
            var file = fs.createWriteStream('results/ServiceWorkers-part' + crawlerNumber + '.txt');
            for(writeLoop = 0; writeLoop < ServiceWorkers.length; writeLoop++){
                file.write(ServiceWorkers[writeLoop] + "\n");
            }
            file.end();
            console.log("ServiceWorkers.txt was successfully created!\n");
        }catch(err){
            console.log("\n\n");
            console.log("Service Workers:\n");
            console.log(ServiceWorkers);
        }

        try{
            var file = fs.createWriteStream('results/noServiceWorkersSites-part' + crawlerNumber + '.txt');
            for(writeLoop = 0; writeLoop < noServiceWorkers.length; writeLoop++){
                file.write(noServiceWorkers[writeLoop] + "\n");
            }
            file.end();
            console.log("noServiceWorkersSites.txt was successfully created!\n");
        }catch(err){
            console.log("\n\n");
            console.log("Site Without Service Worker:\n");
            console.log(noServiceWorkers);
        }

        try{
            var file = fs.createWriteStream('results/withServiceWorkersSites-part' + crawlerNumber + '.txt');
            for(writeLoop = 0; writeLoop < ServiceworkersSites.length; writeLoop++){
                file.write(ServiceworkersSites[writeLoop] + "\n");
            }
            file.end();
            console.log("withServiceWorkersSites.txt was successfully created!\n");
        }catch(err){
            console.log("\n\n");
            console.log("Site Without Service Worker:\n");
            console.log(ServiceworkersSites);
        }

        try{
            var file = fs.createWriteStream('Statistics/part' + crawlerNumber + '.txt');
            file.write("Statistics\n");
            file.write("=============================\n");
            file.write("\n");
            file.write("" + SitesThatRegisterServiceWorkersCount + "/" + url_list.length + " of sites registers a SW");
            file.end();
            console.log("Statistics were successfully registered!\n");
        }catch(err){
            console.log("\n\n");
            console.log("Statistics\n");
            console.log("=============================\n");
            console.log("\n");
            console.log("" + SitesThatRegisterServiceWorkersCount + "/" + url_list.length + " of sites registers a SW");
        }
    });
});