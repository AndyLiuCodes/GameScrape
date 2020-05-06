const puppeteer = require('puppeteer');
const cheerio = require("cheerio");
// async function fetchHTML(url){
//     try {
//         const { data } = await axios.get(url);

//         return cheerio.load(data);
//     }
//     catch{
//         console.log(`ERROR: An error occured when fetching URL ${url}`);
//     }
// }

function extractSteamItems(){
    const extractedElements = document.querySelectorAll('#search_result_container > #search_resultsRows > a');
    const items = [];
    for (let element of extractedElements) {
        
        items.push({data: element.innerHTML, link: element.href});
    }
    return items;   
}

function extractSteamInfo(game){
    const selector = cheerio.load(game.data);
    
    const title = selector('.responsive_search_name_combined > .search_name > .title')
        .text()
        .trim();
    
    const releaseDate = selector('.responsive_search_name_combined > .search_released')
        .text()
        .trim();

    const price = selector('.responsive_search_name_combined > .search_price_discount_combined')
        .text()
        .trim();
    
    const imgURL = selector('.search_capsule > img').attr('src');

    const link = game.link;

    return {title, releaseDate, price, imgURL, link};
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
var ScrapeSteam = async (numItems) => {

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const steamPage = await browser.newPage()
    steamPage.setViewport({width: 1920, height: 1080});
    
    const steamURL = "https://store.steampowered.com/search/?sort_by=Reviews_DESC&maxprice=free";
    
    await steamPage.goto(steamURL);
    
    const steamGames = await scrapeInfinitePage(steamPage, extractSteamItems, numItems);

    await browser.close();
    
    const steamResults = steamGames.map((ele) => {
        return extractSteamInfo(ele);
    });
    
    return steamResults;
}

//REDDIT
async function ScrapeReddit(){

}

//EPIC GAMES
async function ScrapeEpic(){

}


//ITCH.IO
async function ScrapeItch(){

}

module.exports = {
    ScrapeSteam: ScrapeSteam
}