require("./lib/browser.js");
require("./lib/s3.js")();
require("./lib/ops.js")();

const postfix = ".json";

const handler  = async (args) => {
    //check CLI
    var site=null
    if ((args!=null) && (args["site"] != null)){
        site = args["site"].replace('www.','');
    } else {
        if (process.argv.length>2){
            site = process.argv.slice(2)[0].replace('www.','');
        } else {
            console.log("Error: no input domain given")
            process.exit(1)
        }
    } try {
        console.log("Start scraping "+site)
        const SimilarWeb_prefix = "https://www.similarweb.com/website/"
        var result = await browseSite(SimilarWeb_prefix+site, null, similarweb);
        console.log(result)
        await uploadRawToS3(result, site+"_similarweb"+postfix);
    } catch (err) {
        console.error(err);
    }
}

module.exports.handler = handler;