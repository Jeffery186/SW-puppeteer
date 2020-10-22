const http = require('http');
const fs = require('fs');
const puppeteer = require('puppeteer');

const hostname = '127.0.0.1';
const port = 3000;
let ServiceWorkers;
var functonsDef;
var content;
var server;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function initialization(){
    ServiceWorkers = await fs.readdirSync('ServiceWorkers');
    ServiceWorkers.pop();
    console.log(ServiceWorkers);
}

async function createServer(source, filename, message){
    functonsDef = `
        (function(console){

            console.save = function(data){
            
                if(!data) {
                    console.error('Console.save: No data')
                    return;
                }

                if(data.indexOf('http') === -1){
                    data = 'http://${filename}' + data;
                }
            
                if(typeof data === "object"){
                    data = JSON.stringify(data, undefined, 4)
                }
            
                var blob = new Blob([data], {type: 'text/json'}),
                    e    = document.createEvent('MouseEvents'),
                    a    = document.createElement('a')
            
                a.download = '${filename}.json'
                a.href = window.URL.createObjectURL(blob)
                a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
                e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
                a.dispatchEvent(e)
            }
        })(console)
    `;
    content = fs.readFileSync(source, {encoding: 'ascii'});

    while(content.indexOf("importScripts") !== -1){
        content = content.replace("importScripts", "console.save");
    }

    server = http.createServer((req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end("<script>" + functonsDef + content + "</script><h1>" + message + "</h1>");
    });

    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
}

async function waitAndClose(ms){
    await sleep(ms);

    try{
        await server.close();
        console.log("Server successfully closed!");
    }catch(err){
        console.log("An error has occured: " + err);
    }
}

async function program(){
    await initialization();
    var browser = await puppeteer.launch({
        headless: false
    });
    let pages =  await browser.pages();
    let page = pages[0];
    for(let i = 0; i < ServiceWorkers.length; i++){
        console.log('Checking service worker ' + (i + 1) + '/' + ServiceWorkers.length)
        await createServer('ServiceWorkers/' + ServiceWorkers[i], ServiceWorkers[i].split('-')[0], 'Checking service worker ' + (i + 1) + '/' + ServiceWorkers.length);
        await page.goto(`http://${hostname}:${port}/`);
        await waitAndClose(10000);
    }
    await browser.close();
}

program();