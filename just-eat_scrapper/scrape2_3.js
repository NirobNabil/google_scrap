const puppeteer = require('puppeteer');
const fs = require('fs');
const { mainModule } = require('process');

async function scrape() {

    const browser = await puppeteer.launch({headless: false});

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
    
    var data = [];
    var individual_urls = fs.readFileSync('./url_list.txt', 'utf-8').split('\n');
    var data = JSON.parse(fs.readFileSync('./data.json'));
    while(individual_urls[0] !== "") {
        let d = await scrape2(individual_urls[0]);
        d = {
            ...d,
            ...await scrape3(d.name+' '+d.address)
        }
        data.push(d);
        fs.writeFileSync("./data.json", JSON.stringify(data, null, '\t')) //remove '/t' to disable pretty print
        fs.writeFileSync("./url_list.txt", individual_urls.slice(1).reduce( (s,v) => s += v+'\n', "" ).slice(0,-1));
        individual_urls = fs.readFileSync('./url_list.txt', 'utf-8').split('\n');
    }
    
    browser.close();
    return "done!!!!!"
}



urls = [
    "https://www.just-eat.co.uk/area/b13-birmingham",
    "https://www.just-eat.co.uk/area/ab21-aberdeen",
]

async function main() {
    // result = [];
    // for(let i=0; i<urls.length; i++) {
    //     const data = await scrape(urls[i]);
    //     console.log(data);
    //     data.map( (d) => result.push(d) );
    // }
    // return result;
    return await scrape();
}

main().then( (d)=> console.log(d) )

// main().then( (data) => {
//     fs.writeFileSync("./data.json", JSON.stringify(data, null, '\t')) //remove '/t' to disable pretty print
// });


