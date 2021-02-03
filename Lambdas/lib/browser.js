const puppeteer = require('puppeteer');
const chromium = require('chrome-aws-lambda');

browseSite = async function (site, cookies, doJob) {
    var res = [];
    const browser = await chromium.puppeteer.launch({
      args: [
            "--no-sandbox",
            // error when launch(); Failed to load libosmesa.so
           "--disable-gpu",
            // freeze when newPage()
            "--single-process",
        ],
      defaultViewport: {
            width: 1920,
            height: 1080,
        },
      executablePath: await chromium.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    });
    try {
        const page = await browser.newPage()
        if (cookies!=null)
            await page.setCookie(...cookies);
        let salt = Math.floor(Math.random() * 101);
        await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.50 Safari/"+salt)
        await page.goto(site, {
            waitUntil: 'networkidle0',//'domcontentloaded',
            timeout: 190000
        });
        res = await doJob(page);
    } catch (exception) {
          console.log(`Error fetching ${site}`);
          console.log(exception);
    } 
    await browser.close()
    return res
}

module.exports.browseSite = browseSite;
