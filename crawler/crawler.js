const puppeteer = require('puppeteer');
const fs = require('fs');
const scrape = require('website-scraper');

let input_file = process.argv[4].substr(1,process.argv[4].length);
let crawlerNumber = process.argv[5].substr(1,process.argv[5].length);
let permitions = false;

let url_list = [];
let ServiceWorkers = [];
let noServiceWorkers = [];
let rawData;
let rawDataList;
let data;
let timeout = true;
let arguments = [
    '--enable-features=NetworkService',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--ignore-certificate-errors',
    '--disable-gpu',
    //'--headless'
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
        // Outputs HTML 
        // console.log(result);
        console.log(site.split('/')[2] + " content succesfully downloaded.");
    }).catch(function (err) {
        console.log("Failed to download " + site.split('/')[2] + ".");
    });
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
    
    for (let i = 0; i < url_list.length; i++){
        it("("+ (i + 1) + "/" + url_list.length + ") Checked " + url_list[i].split('/')[2], async() => {
            for(let reloadLoop = 0; reloadLoop < 2; reloadLoop++){
                console.log("Loop number #" + (reloadLoop + 1));

                // Step 1: launch browser and take the page.
                var browser = await puppeteer.launch({
                    headless: false,
                    defaultViewport: {
                        width: 1500,
                        height: 1000,
                        isMobile: false
                    },
                    args: arguments
                });
                const context = browser.defaultBrowserContext();
                let pages =  await browser.pages();
                const page = pages[0];
        
                let url = url_list[i];
        
                var swTargetFound;
                
                page.setDefaultNavigationTimeout(90000);
                if (permitions) await context.overridePermissions(url, ['notifications']);

                try{
                    await page.goto(url, {waitUntil: 'load'});
                    timeout = false;
        
                    swTargetFound = await browser.waitForTarget(target => {
                        if(target.type() === 'service_worker'){
                            console.log(target.type());
                            console.log(target.url());
                            ServiceWorkers.push(target.url());
                            return true;
                        }
                    }, {
                        timeout: 5000
                    });

                    if(swTargetFound){
                        await downloadSite(page.url());
                        await browser.close();
                        break;
                    }
                }catch(err){
                    try{
                        if(timeout){
                            browser.close();
                            break;
                        }

                        await page.goto(url);
        
                        swTargetFound = await browser.waitForTarget(target => {
                            if(target.type() === 'service_worker'){
                                console.log(target.type());
                                console.log(target.url());
                                ServiceWorkers.push(target.url());
                                return true;
                            }
                        }, {
                            timeout: 15000
                        });

                        if(swTargetFound){
                            await downloadSite(page.url());
                            await browser.close();
                            break;
                        }
                    }catch(err){
                        if(reloadLoop === 1){
                            await browser.close();
                            noServiceWorkers.push(url);
                            //throw err;
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
            var file = fs.createWriteStream('Statistics/part' + crawlerNumber + '.txt');
            file.write("Statistics\n");
            file.write("=============================\n");
            file.write("\n");
            file.write("" + ServiceWorkers.length + "/" + url_list.length + " of sites registers a SW");
            file.end();
            console.log("Statistics were successfully registered!\n");
        }catch(err){
            console.log("\n\n");
            console.log("Statistics\n");
            console.log("=============================\n");
            console.log("\n");
            console.log("" + ServiceWorkers.length + "/" + url_list.length + " of sites registers a SW");
        }
    });
});