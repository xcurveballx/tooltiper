// UI testing
const assert = require("chai").assert;
const puppeteer = require("puppeteer");
let browser, page,
url = "file:///C:/Users/mine/Desktop/projects/tooltiper/example.html";

// puppeteer options
const opts = {
  headless: false,
  slowMo: 250
};

before(async () => {
  browser = await puppeteer.launch(opts);
  page = await browser.newPage();
});

describe("Tests that the tooltip shows up with different settings", function() {
    it("Basic usecase, tooltip is shown with default settings", async () => {
        await page.goto(url);
        await page.waitForSelector(".example1 a");
        await page.hover(".example1 a");
        let ttText = await page.evaluate(() => document.querySelector(".example1 span.js-tooltiper").textContent);
        assert.equal("Tooltiper - jQuery Plugin", ttText);
    });

    it("Tooltip is shown with HTML-tags inside", async () => {
        await page.goto(url);
        await page.waitForSelector(".example2 a");
        await page.hover(".example2 a");
        let ttText = await page.evaluate(() => document.querySelector(".example2 span.js-tooltiper b").textContent);
        assert.equal("Tooltiper", ttText);
    });

    it("Tooltip is shown with given appearence mode", async () => {
        await page.goto(url);
        await page.waitForSelector(".example3 a");
        await page.hover(".example3 a");
        let ttText = await page.evaluate(() => document.querySelector(".example3 span.js-tooltiper").textContent);
        assert.equal("Tooltiper - jQuery Plugin", ttText);
    });

    it("Tooltip is shown with given appearence speed", async () => {
        await page.goto(url);
        await page.waitForSelector(".example4 a");
        await page.hover(".example4 a");
        let ttText = await page.evaluate(() => document.querySelector(".example4 span.js-tooltiper").textContent);
        assert.equal("Tooltiper - jQuery Plugin", ttText);
    });

    it("Tooltip is shown and moves after the cursor", async () => {
        await page.goto(url);
        await page.waitForSelector(".example5 a");
        await page.hover(".example5 a");

        let initialTtPosLeft = parseFloat(await page.evaluate(() => document.querySelector(".example5 span.js-tooltiper").style.left));

        let link = await page.$('.example5 a');
        let linkPos = await page.evaluate((link) => {
            const {top, left} = link.getBoundingClientRect();
            return {top, left};
        }, link);

        await page.mouse.move(linkPos.left + 5, linkPos.top + 5);

        let finalTtPosLeft = parseFloat(await page.evaluate(() => document.querySelector(".example5 span.js-tooltiper").style.left));

        assert.notEqual(initialTtPosLeft, finalTtPosLeft);
    });

    it("Tooltip is shown using custom tag and styles", async () => {
        await page.goto(url);
        await page.waitForSelector(".example6 a");
        await page.hover(".example6 a");
        let ttColor = await page.evaluate(() => document.querySelector(".example6 div.js-fancy-class").style.color);
        assert.equal("red", ttColor);
    });

    it("Tooltip is shown and is chainable", async () => {
        page.on('dialog', async dialog => {
            assert.equal("This click-event handler has been chained to the Tooltiper!", dialog.message());
            await dialog.accept();
        });
        await page.goto(url);
        await page.waitForSelector(".example7 a");
        await page.hover(".example7 a");
        await page.evaluate(() => document.querySelector(".example7 a").click());
    });
});

after(async () => {
  await browser.close();
});
