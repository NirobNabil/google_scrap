const puppeteer = require('puppeteer');
const fs = require('fs');
const { mainModule } = require('process');

async function scrape(list_url) {

    const browser = await puppeteer.launch({headless: false});
    //restaurant list parse
    async function scrape1 (url) {
        const page = await browser.newPage();
        await page.goto(url)
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
        return nodes;
    }

    //individual restaurant website parser
    async function scrape2 (url) {
        const page = await browser.newPage();
        await page.goto(url);
        const d = await page.evaluate(() => {
            return {
                name: document.querySelector('.c-mediaElement-heading').textContent.trim(),
                address: document.querySelector('.c-restaurant-header-address-content').textContent.trim(),
            }
        });
        page.close();
        return d;
    }
    
    //search google with restaurant_name+restaurant_address
    async function scrape3(qstring) {
        const page = await browser.newPage();
        await page.goto("https://www.google.com");
        await page.type('input.gLFyf.gsfi', qstring);
        page.keyboard.press('Enter');
        await page.waitForNavigation({
            waitUntil: 'networkidle0',
        });
        const data = await page.evaluate( ()=> {
            return {
                'phone': document.querySelectorAll('.LrzXr')[1]?.textContent,
                'website': document.querySelectorAll('.QqG1Sd')[0]?.children[0]?.href
            }
        })
        page.close();
        return data;
    }
    

    // individual_urls = (await scrape1(list_url)).slice(0,5);  //processing only 5 restaurants. comment this line in production
    var individual_urls=[];
    for(let i=0; i<5; i++) {
        let individual_urls_t = (await scrape1(list_url));   //uncomment this line to process every retaurnt
        if(individual_urls_t.length > individual_urls) individual_urls = individual_urls_t;    
    }
    var data = [];
    console.log(individual_urls.length);
    for(let i=0; i<individual_urls.length; i++) {
        let d = await scrape2(individual_urls[i]);
        d = {
            ...d,
            ...await scrape3(d.name+' '+d.address)
        }
        data.push(d);
    }

    browser.close();
    return data;
}



urls = [
    "https://www.just-eat.co.uk/area/b13-birmingham",
    "https://www.just-eat.co.uk/area/ab21-aberdeen",
]

async function main() {
    result = [];
    for(let i=0; i<urls.length; i++) {
        const data = await scrape(urls[i]);
        console.log(data);
        data.map( (d) => result.push(d) );
    }
    return result;
}

main().then( (data) => {
    fs.writeFileSync("./data.json", JSON.stringify(data, null, '\t')) //remove '/t' to disable pretty print
});


