var https = require('https');
var http = require('http');
var fs = require('fs');
const colors = require('colors');

destination = 'ServiceWorkers/';
sourceFile = process.argv[2].substr(1,process.argv[2].length);
IDnumber = process.argv[3].substr(1,process.argv[3].length);
serviceWorkerUrls = [];

function downloadSW(url, dest) {
  var file = fs.createWriteStream(dest);
  if(url.indexOf('https') !== -1){
    var request = https.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
          console.log((url + ' was successfully dowloaded!').green)
        file.close();  // close() is async, call cb after close completes.
      });
      }).on('error', function(err) { // Handle errors
        fs.unlink(dest, function () {
          console.log(('An error has occur with file ' + url).red);
        }); // Delete the file async. (But we don't check the result)
      });
  }else{
    var request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
        console.log((url + ' was successfully dowloaded!').green)
      file.close();  // close() is async, call cb after close completes.
    });
    }).on('error', function(err) { // Handle errors
        fs.unlink(dest, function () {
          console.log(('An error has occur with file ' + url).red);
        }); // Delete the file async. (But we don't check the result)
    });
  }
  
};

rawData = fs.readFileSync(sourceFile, {encoding: 'ascii'});
serviceWorkerUrls = rawData.split('\n');

if(serviceWorkerUrls[serviceWorkerUrls.length - 1] === '')serviceWorkerUrls.pop();

var uniq = serviceWorkerUrls.map((name) => {
    return {
      count: 1,
      name: name
    }
}).reduce((a, b) => {
    a[b.name] = (a[b.name] || 0) + b.count
    return a
}, {})

var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1)

console.log(('duplicate SW: ' + duplicates.length).cyan.underline.bold);
console.log(('Expected files: ' + (serviceWorkerUrls.length - duplicates.length)).cyan.underline.bold);

serviceWorkerUrls.forEach(element => {
    downloadSW(element.split('?')[0], destination + element.split('/')[2] + '()' + element.split('/')[3].split('.')[0] + '-' + IDnumber + '.js')
});