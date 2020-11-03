const http = require('http');
const fs = require('fs');
const puppeteer = require('puppeteer');
const colors = require('colors');
var path = require('path');

const hostname = '127.0.0.1';
const port = 3000;
let permitions = false;
let ServiceWorkers;
var content;
var server;
var browser;
let page;


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function initialization(){
    ServiceWorkers = await fs.readdirSync('ServiceWorkers');
    ServiceWorkers.pop();
}

async function openBrowser(){
    browser = await puppeteer.launch({
        headless: false,
        devtools: true,
        defaultViewport:{
            height: 1200,
            width: 1900,
            isMobile: false
        },
        //executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
        //ignoreDefaultArgs: ["--disable-extensions"],
        args: [
            "--proxy-server=http://127.0.0.1:8080",
            "--ignore-certificate-errors",
            "--ssl-version-min=tls1",
            "--ssl-version-max=tls1.2",
            "--tlsv1",
            "--tlsv1.1",
            "--tlsv1.2"
        ]
    });
    let context = browser.defaultBrowserContext();
    let pages =  await browser.pages();
    page = pages[0];

    if(permitions)await context.overridePermissions(`http://${hostname}:${port}/`, ['notifications']);
}

async function createServer(source, filename, message){

    server = http.createServer((request, response) => {

        var filePath = '.' + request.url;
        console.log(filePath);
        if (filePath == './'){
            response.statusCode = 200;
            response.setHeader('Content-Type', 'text/html');
            response.end("<script>" + "Notification.requestPermission().then(navigator.serviceWorker.register('" + source + "'))" + "</script><h1>" + message + "</h1>");
            return;
        }

        if (filePath == './favicon.ico'){
           return;
        }

        var extname = path.extname(filePath);
        var contentType = 'text/html';
        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            default:
                return;
        }

        fs.readFile(filePath, 'utf-8', function(error, content) {
            if (error) {
                console.log('an error has occured: '.red + error)
            }else {
                response.writeHead(200, { 'Content-Type': contentType });
                //console.log(content);
                response.end(content);
            }
        });

        closed = false;
    });

    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`.bgBlue);
    });

    server.on('close', () => {
        console.log("Server successfully closed!".green);
        closed = true;
    });
}

async function waitAndClose(ms){
    await sleep(ms);

    try{
        console.log("closing server...".italic.yellow)
        await server.close();
    }catch(err){
        console.log(("An error has occured: " + err).red);
    }
}

async function program(){
    await initialization();

    for(let i = 0; i < ServiceWorkers.length; i++){
        await openBrowser();
        console.log(('Checking service worker ' + (i + 1) + '/' + ServiceWorkers.length).bold);
        console.log("name: " + ServiceWorkers[i])
        await createServer('ServiceWorkers/' + ServiceWorkers[i], ServiceWorkers[i].split('-')[0], 'Checking service worker ' + (i + 1) + '/' + ServiceWorkers.length);
        await page.goto(`http://${hostname}:${port}/`);
        await waitAndClose(300000);
        await browser.close();
    }
}

program();