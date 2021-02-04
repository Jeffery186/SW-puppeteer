const fs = require('fs')

module.exports = function () {

    this.stripit = function(str){
        return str.replace(/\s/g, "")
    };

    this.storeJSON = function(elem, filename){
        if ((elem == null) ||  (filename==null))
            return;
        fs.writeFileSync(filename, JSON.stringify(elem), encoding="utf8");
        console.log('> Data Saved in ' + filename);
    };

    this.handleTable = function(str){
        return str.replace(/ /g, "").split("\n");
    };

    this.stripDomain = function(str){
        return stripit(str.replace('www.','').replace(",", ""));
    };

    this.onlyUnique = function(value, index, self){
        return self.indexOf(value) === index;
    };
}