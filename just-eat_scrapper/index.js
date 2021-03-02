const puppeteer = require('puppeteer');
const fs = require('fs');

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
        return d;
    }

    individual_urls = (await scrape1(list_url)).slice(0,5);
    var data = [];
    for(let i=0; i<individual_urls.length; i++) {
        data.push(await scrape2(individual_urls[i]));
    }
    browser.close();
    return data;
}

urls = [
    "https://www.just-eat.co.uk/area/b13-birmingham",
]

Promise.all(urls.map( async (url) => {
    const data = await scrape(url);
    console.log(data);
    return {url: data};
})).then( (data) => {
    fs.writeFileSync("./data.json", JSON.stringify(data, null, '\t'))
});
