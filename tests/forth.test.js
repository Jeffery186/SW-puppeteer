const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

let forks = numCPUs;

function runCrawler(){
    console.log("hello from child!");
}

if (cluster.isMaster) {
    for (let i = 0; i < forks; i++){
        cluster.fork();
        console.log('Fork #' + (i + 1));
    }
}else{
    runCrawler();
    process.exit();
}