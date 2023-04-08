//@ts-check
const { chromium } = require('playwright-chromium');
const { expect } = require('chai');
const { describe } = require('node:test');
const exp = require('constants');


let browser;
let context;
let page;

describe('E2E tests', function () {
    this.timeout(6000);

    before(async () => {
        // browser = await chromium.launch({ headless: false, slowMo: 500 });
        browser = await chromium.launch();
    });

    after(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        context = await browser.newContext();

        // block intensive resources and external calls (page routes take precedence)
        await context.route('**/*.{png,jpg,jpeg}', route => route.abort());
        await context.route(url => {
            return url.hostname != 'localhost';
        }, route => route.abort());

        page = await context.newPage();
    });

    afterEach(async () => {
        await page.close();
        await context.close();
    });

    describe('catalog', () => {
        it('loads and displays recipes', async () => {
            await page.goto('http://localhost:3000');
            await page.waitForSelector('article');

            const titles = await page.$$eval('h2', titles => titles.map(t => t.textContent));

            expect(titles[0]).to.contain('Easy Lasagna');
            expect(titles[1]).to.contain('Grilled Duck Fillet');
            expect(titles[2]).to.contain('Roast Trout');
        })
    })

});
