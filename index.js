const puppeteer = require("puppeteer");
const moment = require("moment");
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const lastName = process.env.LAST_NAME;
const licenseNumber = process.env.LICENSE_NUMBER;
const passPhrase = process.env.PASS_PHRASE;
const NOW_APPO = process.env.NOW_APPO;
const PHONE_NUMBER = process.env.PHONE_NUMBER;
const TWILIO_NUMBER = process.env.TWILIO_NUMBER;

const client = require("twilio")(accountSid, authToken);
var notFound = true;
(async () => {
  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 1200,
      height: 800,
    },
    headless: false,
  });
  const page = await browser.newPage();
  while (notFound) {
    await run(page);
  }
})();

async function run(page) {
  await page.goto(
    "https://onlinebusiness.icbc.com/webdeas-ui/login;type=driver"
  );
  // login
  await page.type("#mat-input-0", lastName);
  await page.type("#mat-input-1", licenseNumber);
  await page.type("#mat-input-2", passPhrase);
  await page.waitForSelector("#mat-checkbox-1-input");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Space");
  await page.screenshot({ path: "before.png" });
  let buttons = await page.$$("[type=button]");
  await buttons[1].click();
  await page.waitForNavigation();
  // select reschedule appointmnet
  await page.waitForSelector(
    ".raised-button.mat-raised-button.mat-button-base.mat-accent"
  );
  buttons = await page.$$(
    ".raised-button.mat-raised-button.mat-button-base.mat-accent"
  );
  await buttons[0].click();

  // yes on the confirmation screen
  await page.waitForTimeout(1000);
  buttons = await page.$$(
    ".mat-raised-button.mat-button-base.mat-accent.ng-star-inserted"
  );
  await buttons[0].click();

  // type vancouver
  await page.type("#mat-input-3", "Vancouver, ");
  // await page.select("#mat-input-3");
  await page.waitForTimeout(4000);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(2000);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1000);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1000);

  await page.waitForSelector(".department-container.ng-star-inserted");
  const links = await page.$$(".department-container.ng-star-inserted");
  await page.waitForTimeout(2000);
  console.log(links.length);
  const indices = [0, 1, 3];

  let count = 1;
  while (true) {
    if (count % 350 == 0) {
      return;
    }
    console.log(`trial: ${count}`);
    count++;
    for (let i = 0; i < 3; i++) {
      let toClick = links[indices[i]];
      await toClick.click();
      await page.waitForTimeout(1500);
      let date = await page.$$(".date-title");
      date = date[0];
      if (!date) continue;
      const dateText = await date.evaluate((node) => node.innerText);
      console.log(dateText);
      const nowAppo = moment(NOW_APPO);
      const nextAppo = moment(dateText, "dddd, MMMM Do, YYYY");
      if (nowAppo > nextAppo) {
        console.log("earlier appointment was found");
        notFound = false;
        const message = await client.messages.create({
          body: "New appointmnet was found!",
          from: TWILIO_NUMBER,
          to: PHONE_NUMBER,
        });
        console.log(message.sid);
        return;
      }
    }
  }
}
