require("./lib/browser.js");
require("./lib/s3.js")();
require("./lib/ops.js")();
const fs = require("fs").promises;

const postfix = ".json";

const handler  = async (args) => {
    //check CLI
    var site=null
    if ((args!=null) && (args["site"] != null)){
        site = stripDomain(args["site"])
    } else {
        if (process.argv.length>2){
            site = stripDomain(process.argv.slice(2)[0])
        } else {
            console.log("Error: no input domain given")
            process.exit(1)
        }
    } try {
        let outfile = site+"_similarweb"+postfix;
        if (await siteParsed(outfile)){
            console.log("Site: "+site+" was parsed already")
        }else{
            console.log("Start scraping "+site)
            const SimilarWeb_prefix = "https://www.similarweb.com/website/"
            var result = await browseSite(SimilarWeb_prefix+site, null, similarweb);
            console.log(result)
            if (Object.keys(result).length != 0){
                await uploadRawToS3(result, outfile);
            }
        }
    } catch (err) {
        console.error(err);
    }
}

//handler()
module.exports.handler = handler;