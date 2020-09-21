const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

// Airtable Objekt erstellen

const Airtable = require('airtable');
const base = new Airtable({apiKey: 'key3iD7Y3z6WC449f'}).base('appElFgjobSxAEMuv');


// Anbfrage der Einträge

const url = base('Scraping').find('recWECzZUxjrcQiwP'); 




//Startet Server auf Port 3000
app.listen(3000, () => console.log('Server is running at 3000'));



// Eingabe der URL
//const url = 'https://www.google.com/maps/place/INKLABS+Tattoo+Studio+-+Dresden/@51.0697931,13.7455276,17.26z/data=!4m5!3m4!1s0x4709cf17d2e6a06b:0x88d6367addb5dee6!8m2!3d51.0694148!4d13.7476674';


//Delay Function (if needed)
function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }



// Provenexpert Scraper
async function scrapeProvenexpert(url)   {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(url);
    await delay(3000);

    // 5 Sterne Bewertungen String
    const [el] = await page.$x('//*[@id="ratingStream"]/div[1]/div/ul/li[2]/a');
    const txt = await el.getProperty('textContent');
    const fivestars = await txt.jsonValue();

    // 4 Sterne Bewertungen String
    const [el2] = await page.$x('//*[@id="ratingStream"]/div[1]/div/ul/li[3]/a');
    const txt2 = await el2.getProperty('textContent');
    const fourstars = await txt2.jsonValue();

    // 3 Sterne Bewertungen String
    const [el3] = await page.$x('//*[@id="ratingStream"]/div[1]/div/ul/li[4]/a');
    const txt3 = await el3.getProperty('textContent');
    const threestars = await txt3.jsonValue();

    // 2 Sterne Bewertungen String
    const [el4] = await page.$x('//*[@id="ratingStream"]/div[1]/div/ul/li[5]/a');
    const txt4 = await el4.getProperty('textContent');
    const twostars = await txt4.jsonValue();

    // 1 Stern Bewertungen String
    const [el5] = await page.$x('//*[@id="ratingStream"]/div[1]/div/ul/li[6]/a');
    const txt5 = await el5.getProperty('textContent');
    const onestar = await txt5.jsonValue();

    // Berechnung der Anzahl Gesamt

    const fivestarsformatiert = fivestars.replace('5 Sterne (','').replace(/([^0-9])/g, "");
    const fourstarsformatiert = fourstars.replace('4 Sterne (','').replace(/([^0-9])/g, "");
    const threestarsformatiert = threestars.replace('3 Sterne (','').replace(/([^0-9])/g, "");
    const twostarsformatiert = twostars.replace('2 Sterne (','').replace(/([^0-9])/g, "");
    const onestarformatiert = onestar.replace('1 Stern (','').replace(/([^0-9])/g, "");

    const anzahl = parseInt(fivestarsformatiert) + parseInt(fourstarsformatiert) + parseInt(threestarsformatiert) + parseInt(twostarsformatiert) + parseInt(onestarformatiert);

    // Berechnung der Durchschnittsbewertung

    const rating = ((parseInt(fivestarsformatiert) * 5) + (parseInt(fourstarsformatiert) * 4) + (parseInt(threestarsformatiert) * 3) + (parseInt(twostarsformatiert) * 2) + (parseInt(onestarformatiert) * 1)) / anzahl;

    // Print Ergebnis
    console.log({rating, anzahl});

    browser.close();
}

// Google My Business Scraper
async function scrapeGmb(url)   {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(url);
    await delay(3000);
    //await page.click('/html/body/div/c-wiz/div[2]/div/div/div/div/div[2]/form/div');

    // Rating String
    await page.waitForXPath('//*[@id="pane"]/div/div[1]/div/div/div[2]/div[1]/div[1]/div[2]/div/div[1]/span[1]/span/span');
    const [el] = await page.$x('//*[@id="pane"]/div/div[1]/div/div/div[2]/div[1]/div[1]/div[2]/div/div[1]/span[1]/span/span');
    const txt = await el.getProperty('textContent');
    const ratingstring = await txt.jsonValue();

    // Anzahl String
    await page.waitForXPath('//*[@id="pane"]/div/div[1]/div/div/div[2]/div[1]/div[1]/div[2]/div/div[1]/span[2]/span/span/span[2]/span[1]/button');
    const [el2] = await page.$x('//*[@id="pane"]/div/div[1]/div/div/div[2]/div[1]/div[1]/div[2]/div/div[1]/span[2]/span/span/span[2]/span[1]/button');
    const txt2 = await el2.getProperty('textContent');
    const anzahlunformatiert = await txt2.jsonValue();

    // Filtert Zahlen aus String
    var anzahlstring = await anzahlunformatiert.replace(/([^0-9])/g, "");

    const anzahl = parseInt(anzahlstring);
    const rating = ratingstring

    // Print Ergebnis
    console.log({rating, anzahl});

    browser.close();
}

// Facebook Bewertungen Scraper - NICHT FUNKTIONAL
async function scrapeFacebook(url)   {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(url);
    await delay(3000);

    // Rating String
    await page.waitForXPath('//*[@id="mount_0_0"]/div/div[1]/div[1]/div[3]/div/div/div[1]/div[1]/div[4]/div/div/div[1]/div[2]/div/div[2]/div/div/div/div[1]/span/text()');
    const [el] = await page.$x('//*[@id="mount_0_0"]/div/div[1]/div[1]/div[3]/div/div/div[1]/div[1]/div[4]/div/div/div[1]/div[2]/div/div[2]/div/div/div/div[1]/span/text()');
    const txt = await el.getProperty('textContent');
    const ratingunformatiert = await txt.jsonValue();

    // Anzahl String
    await page.waitForXPath('//*[@id="mount_0_0"]/div/div[1]/div[1]/div[3]/div/div/div[1]/div[1]/div[4]/div/div/div[1]/div[2]/div/div[2]/div/div/div/div[2]/span/text()');
    const [el2] = await page.$x('//*[@id="mount_0_0"]/div/div[1]/div[1]/div[3]/div/div/div[1]/div[1]/div[4]/div/div/div[1]/div[2]/div/div[2]/div/div/div/div[2]/span/text()');
    const txt2 = await el2.getProperty('textContent');
    const anzahlunformatiert = await txt2.jsonValue();


    const anzahlstring = await anzahlunformatiert.replace(/([^0-9])/g, "");
    const ratingstring = await ratingunformatiert.replace(' out of 5','').replace(' von 5','');


    anzahl = await parseInt(anzahlstring);
    rating = await ratingstring;

    // Print Ergebnis
    console.log({rating, anzahl});

    browser.close();
}

// Function ausführen
//scrapeProvenexpert('https://www.provenexpert.com/de-de/pottworks-werbeagentur/');
//scrapeGmb('https://www.google.com/maps/place/INKLABS+Tattoo+Studio+-+Dresden/@51.0697931,13.7455276,17.26z/data=!4m5!3m4!1s0x4709cf17d2e6a06b:0x88d6367addb5dee6!8m2!3d51.0694148!4d13.7476674');
//scrapeFacebook('https://www.facebook.com/dieberaterde/reviews/?ref=page_internal');

//Auswahl des Scrapers anhand der URL
switch (true) {
    case url.includes('provenexpert'):
        scrapeProvenexpert(url);
        break;
    case url.includes('google'):    
        scrapeGmb(url);
        break;
    //case url.includes('facebook'):
        //scrapeFacebook(url);
        //break;
}