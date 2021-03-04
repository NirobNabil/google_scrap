const puppeteer = require('puppeteer');
const fs = require('fs');
const { mainModule } = require('process');

async function scrape(list_url) {
    //restaurant list parse
    async function scrape1 (url) {
        const browser2 = await puppeteer.launch({headless: false});
        const page = await browser2.newPage();

        await page.setRequestInterception(true);

        page.on('request', (req) => {
            if(req.resourceType() == 'texttrack' || req.resourceType() == 'websocket' || req.resourceType() == 'fetch' || req.resourceType() == 'xhr' || req.resourceType() == 'other' || req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
                req.abort();
            }
            else {
                req.continue();
            }
        });



        await page.goto(url);

        const nodes = await page.evaluate( async (sleep) => {
            window.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
            const classname = '.c-listing-item-link';
            var nodes = []
            while(document.querySelectorAll(classname).length !== nodes.length) {
                nodes = document.querySelectorAll(classname);
                window.scrollTo(0, document.body.scrollHeight); //fetch new elements
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            return await Promise.all(Object.keys(nodes).map( async (i) => {
                return nodes[i].href;
            }));
        })
        page.close();
        browser2.close();
        return nodes;
    }

    // individual_urls = (await scrape1(list_url)).slice(0,5);  //processing only 5 restaurants. comment this line in production
    var total_urls = [];
    for(let i=0; i<list_url.length; i++) {
        var individual_urls=[];
        for(let j=0; j<1; j++) {
            let individual_urls_t = (await scrape1(list_url[i]));   //uncomment this line to process every retaurnt
            if(individual_urls_t.length > individual_urls.length) individual_urls = individual_urls_t;    
        }
        total_urls.push(...individual_urls);
    }
    console.log(total_urls.length);

    var fs = require('fs');

    var file = fs.createWriteStream('url_list.txt');
    file.on('error', function(err) { /* error handling */ });
    total_urls.forEach(function(v) { file.write(v + '\n'); });
    file.end();

    return;
}

urls = [
    "https://www.just-eat.co.uk/area/ab10-aberdeen",
    "https://www.just-eat.co.uk/area/ab11-aberdeen",
    // "https://www.just-eat.co.uk/area/ab12-aberdeen",
    // "https://www.just-eat.co.uk/area/ab13-milltimber",
    // "https://www.just-eat.co.uk/area/ab14-peterculter",
    // "https://www.just-eat.co.uk/area/ab15-aberdeen",
    // "https://www.just-eat.co.uk/area/ab16-aberdeen",
    // "https://www.just-eat.co.uk/area/ab21-aberdeen",
    // "https://www.just-eat.co.uk/area/ab22-aberdeen",
    // "https://www.just-eat.co.uk/area/ab23-aberdeen",
    // "https://www.just-eat.co.uk/area/ab24-aberdeen",
    // "https://www.just-eat.co.uk/area/ab25-aberdeen",
    // "https://www.just-eat.co.uk/area/ab30-laurencekirk",
    // "https://www.just-eat.co.uk/area/ab31-banchory",
    // "https://www.just-eat.co.uk/area/ab32-westhill",
    // "https://www.just-eat.co.uk/area/ab33-alford",
    // "https://www.just-eat.co.uk/area/ab34-aboyne",
    // "https://www.just-eat.co.uk/area/ab35-ballater",
    // "https://www.just-eat.co.uk/area/ab36-strathdon",
    // "https://www.just-eat.co.uk/area/ab37-ballindalloch",
    // "https://www.just-eat.co.uk/area/ab38-aberlour",
    // "https://www.just-eat.co.uk/area/ab39-stonehaven",
    // "https://www.just-eat.co.uk/area/ab41-ellon",
    // "https://www.just-eat.co.uk/area/ab42-peterhead",
    // "https://www.just-eat.co.uk/area/ab43-fraserburgh",
    // "https://www.just-eat.co.uk/area/ab44-macduff",
    // "https://www.just-eat.co.uk/area/ab45-banff",
    // "https://www.just-eat.co.uk/area/ab51-inverurie",
    // "https://www.just-eat.co.uk/area/ab52-insch",
    // "https://www.just-eat.co.uk/area/ab53-turriff",
    // "https://www.just-eat.co.uk/area/ab54-huntly",
    // "https://www.just-eat.co.uk/area/ab55-keith",
    // "https://www.just-eat.co.uk/area/ab56-buckie",
    // "https://www.just-eat.co.uk/area/ab99-aberdeen",

    // "https://www.just-eat.co.uk/area/ab10-aberdeen"
]

async function main() {
    scrape(urls);
    return;
}

main();