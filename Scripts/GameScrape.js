const puppeteer = require('puppeteer');
const cheerio = require("cheerio");

async function FetchHTML(url){
    try{
        const {data} = await axios.get(url);
        
        return data;
    }
    catch{
        console.error(`ERROR: An error occured when trying to fetch url: ${url}`)
    }
}

function extractSteamItems(){
    const extractedElements = document.querySelectorAll('#search_result_container > #search_resultsRows > a');
    const items = [];
    for (let element of extractedElements) {
        
        items.push({data: element.innerHTML, link: element.href});
    }
    return items;   
}

function extractSteamInfo(game){
    //Rating
    //Categories

    const selector = cheerio.load(game.data);
    
    var title = selector('.responsive_search_name_combined > .search_name > .title')
        .text()
        .trim();
    
    const price = selector('.responsive_search_name_combined > .search_price_discount_combined > .search_price')
        .children().remove().end()
        .text()
        .trim();
    
    var discountPercentage = selector('.search_price_discount_combined > .search_discount > span')
        .text()
        .trim();

    const imgURL = selector('.search_capsule > img').attr('src');

    const link = game.link;

    const platform = "steam";

    var free = true;

    if(!price.includes("Free")){
        free = false;
    }

    var discounted;

    if(discountPercentage == "" || discountPercentage == null){
        title = title + " " + price;
        discounted = false;
    }
    else{
        title = title + " " + `(${price}/${discountPercentage})`
        discounted = true;
    }
    
    
    return {title, imgURL, link, platform, free, discounted};
}

async function scrapeInfinitePage(
    page,
    extractItems,
    itemTargetCount,
    scrollDelay = 1000,
  ) {
    let items = [];
    try {
      let previousHeight;
      while (items.length < itemTargetCount) {
        items = await page.evaluate(extractItems);
        previousHeight = await page.evaluate('document.body.scrollHeight');
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
        await page.waitFor(scrollDelay);
      }
    } catch(e) { }
    return items.slice(0, itemTargetCount);
}

//STEAM
var ScrapeSteam = async (numItems, url) => {

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const steamPage = await browser.newPage()
    steamPage.setViewport({width: 1920, height: 1080});
    
    const steamURL = "https://store.steampowered.com/search/?sort_by=Reviews_DESC&maxprice=6";
    
    await steamPage.goto(steamURL);
    
    const steamGames = await scrapeInfinitePage(steamPage, extractSteamItems, numItems);

    await browser.close();
    
    var steamResults = steamGames.map((ele) => {
        return extractSteamInfo(ele);
    });
    
    return steamResults;
}

function extractRedditItems(){
    document.querySelectorAll(".linkflair-expired").forEach((a) =>{
        a.remove()
    })

    const extractedElements = document.querySelectorAll('#siteTable > .link');
    
    const items = [];
    for (let element of extractedElements) {
        //title, imgurl, link, platform, free, discounted
        items.push({data: element.innerHTML, link: element.href});
    }
    return items;   
}

function extractRedditInfo(game){

}
//REDDIT
var ScrapeReddit = async (numPages, url) => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const redditPage = await browser.newPage()
    redditPage.setViewport({width: 1920, height: 1080});
    
    const redditURL = "https://old.reddit.com/r/GameDeals/hot/";
    
    await redditPage.goto(redditURL);
    var allGameList = []
    //extract items

    for(let i = 0; i < 2; i++){
        items = await redditPage.evaluate(extractRedditItems);
        allGameList = await allGameList.concat(items)
        
        var href = await redditPage.$eval("#siteTable > div.nav-buttons > span > span > a", a => a.getAttribute('href'));
        await redditPage.goto(href)        
    }

    await browser.close();
    
    var redditResults = redditResults.map((ele) => {
        return extractRedditInfo(ele)
    })
    console.log(allGameList.length)
    //process items

    //return items
}





//ITCH.IO
// async function ScrapeItch(){

// }

function UpdateGameDatabase(){

}

module.exports = {
    ScrapeSteam: ScrapeSteam,
    ScrapeReddit: ScrapeReddit
}