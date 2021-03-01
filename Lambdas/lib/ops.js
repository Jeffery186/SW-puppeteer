require("./utilities.js")();

module.exports = function () {

    this.similarweb = async function (page) {
        var res = {}
        try{
        	console.log("Let's wait a bit to trick antibot")
	        await page.waitForTimeout(10000)
	        console.log("Done")
            let similarSites = [];
            //rank
            let type = await page.$$eval('.websiteRanks-nameText', el => el.map(el => el.textContent))
            let rank = await page.$$eval('.websiteRanks-valueContainer', el => el.map(el => el.textContent))
            if (stripit(rank[0]).indexOf("N/A") !== -1){ //no data in similarweb
            	console.log("Data not available");
            	return {"data": "N/A"}
            }
            //engagement
            let engagement = await page.$$eval('.websitePage-engagementInfoContainer', el => el.map(el => el.textContent))
            let trafficSources = await page.$$eval('.trafficSourcesChart-item', el => el.map(el => el.textContent))
            let similar = await page.$$eval('.similarSitesList-link', el => el.map(el => el.textContent))
	        for (i = 0; i < similar.length; i++) {
	            similarSites.push(handleTable(similar[i])[2]);
	        }
	        res = {"'global_rank'": stripit(rank[0]), 
	            "'country'": type[1], 
	            "'country_rank'": stripit(rank[1]), 
	            "'category'":type[2], 
	            "'category_rank'": stripit(rank[2]),
	            "'total_visits'": handleTable(engagement[0])[7],
	            "'avg_visit_duration'": handleTable(engagement[0])[19],
	            "'pages_per_visit'": handleTable(engagement[0])[25],
	            "'bounce_rate'": handleTable(engagement[0])[31],
	            "'traffic_source_direct'": handleTable(trafficSources[0])[3],
	            "'traffic_source_refferals'": handleTable(trafficSources[1])[3],
	            "'traffic_source_search'": handleTable(trafficSources[2])[3],
	            "'traffic_source_social'": handleTable(trafficSources[3])[3],
	            "'traffic_source_mail'": handleTable(trafficSources[4])[3],
	            "'traffic_source_display'": handleTable(trafficSources[5])[3],
	            "'similar_sites'": similarSites.filter(onlyUnique),
	        };
        	return res
        }catch(exception) {
            console.error(`Error fetching similarSites: `+exception+" on "+page.url());
            return res
        } 
    }
}