const fs = require('fs');

async function program(){
    let notificationSW = [];
    let notificationSites = []
    let content;
    let files = await fs.readdirSync('ServiceWorkers');
    for(let i = 0; i < files.length; i++){
        content = fs.readFileSync('ServiceWorkers/' + files[i], {encoding: 'ascii'});
        content = content.replace(/(\/\*[^*]*\*\/)|(\/\/[^*]*)/g, '');
        if(content.indexOf('Notification(') !== -1){
            notificationSW.push(files[i].split('()')[0]);
        }
    }
    for(let i = 0; i < notificationSW.length; i++){
        if(!(notificationSW[i] in notificationSites)){
            notificationSites.push(notificationSW[i])
        }
    }
    try{
        var file = fs.createWriteStream('notificationsResults/notificationServiceWorkers.txt');
        for(writeLoop = 0; writeLoop < notificationSW.length; writeLoop++){
            file.write(notificationSW[writeLoop] + "\n");
        }
        file.end();
        file = fs.createWriteStream('notificationsResults/statistics.txt');
        file.write("Statistics\n");
        file.write("==================\n\n");
        file.write("" + notificationSW.length + "/" + files.length + " of Service workers use notifications");
        file.end();
        console.log("overall.txt for extra SW was successfully created!\n");
    }catch(err){
        console.log("\n\n");
        console.log("extra Service Workers:\n");
        console.log(notificationSW);
    }
}

program();