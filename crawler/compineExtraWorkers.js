const fs = require('fs');

async function program(){
    let extraSW = [];
    let content;
    let files = await fs.readdirSync('extraServiceWorkers');
    for(let i = 0; i < files.length; i++){
        content = fs.readFileSync('extraServiceWorkers/' + files[i], {encoding: 'ascii'});
        extraSW.push(content);
    }
    try{
        var file = fs.createWriteStream('extraServiceWorkers/overall.txt');
        for(writeLoop = 0; writeLoop < extraSW.length; writeLoop++){
            file.write(extraSW[writeLoop] + "\n");
        }
        file.end();
        console.log("overall.txt for extra SW was successfully created!\n");
    }catch(err){
        console.log("\n\n");
        console.log("extrta Service Workers:\n");
        console.log(extraSW);
    }
}

program();