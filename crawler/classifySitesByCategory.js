const puppeteer = require('puppeteer');
const fs = require('fs');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function readSites(){
    let input_file = process.argv[2].substr(1,process.argv[2].length);
    let sites = []

    rawData = fs.readFileSync(input_file, {encoding: 'ascii'});
    rawDataList = rawData.split('\n');

    if(rawDataList[rawDataList.length - 1] === '')
        rawDataList.pop();

    for(let j = 0; j < rawDataList.length; j++){
        data = rawDataList[j];
        if(data === undefined)continue;
        data = data.split('?')[0];
        if(data.search("http") !== -1){
            sites.push(data.split('/')[2])
        }else{
            sites.push(data)
        }
    }

    if(sites.length > 0)
        console.log("File " + input_file + " was successfully read.");

    return sites
}

async function sitesCategory(site, page){
    await page.waitForSelector('#js-swSearch-input');
    await page.$eval('#js-swSearch-input', (el,value) => el.value = value, site);
    await sleep(2000);
    await page.click('.swSearch-submit');
    try{
        await page.waitForSelector('.js-categoryRank > .websiteRanks-header > .websiteRanks-name > .websiteRanks-nameText');
        let category = await page.$eval('.js-categoryRank > .websiteRanks-header > .websiteRanks-name > .websiteRanks-nameText', el => {
            return el.textContent;
        });
        return category;
    }catch{
        return 'Undefined'
    }
}

async function main(){
    sites = await readSites();
    outputFile = await fs.createWriteStream('siteCalssificationByCategory.txt');

    for(let j = 0; j < sites.length;){
        let browser = await puppeteer.launch({
            headless: false,
            defaultViewport:{
                height: 1200,
                width: 1200,
                isMobile: false
            },
            args: [
                "--ignore-certificate-errors",
                "--ssl-version-min=tls1",
                "--ssl-version-max=tls1.3",
                "--tlsv1",
                "--tlsv1.1",
                "--tlsv1.2",
                "--tlsv1.3"
            ]
        });
        let context = await browser.defaultBrowserContext();
        let pages =  await browser.pages();
        let page = pages[0];

        await page.setDefaultTimeout(90000);

        await page.goto('https://www.similarweb.com/', {waitUntil: 'load'});

        for(let i = j; i < j + 5; i++){
            category = await sitesCategory(sites[i], page);
            await outputFile.write(sites[i] + ' ' + category + '\n');
            console.log(category)
            if(i == sites.length){
                break;
            }
            await sleep(5000);
        }

        await browser.close()
        j += 5;
        sleep(30000)
    }
}

main()