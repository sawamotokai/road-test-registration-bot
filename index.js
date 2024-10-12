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
  // while (notFound) {
  await run(page);
  // }
})();

async function run(page) {
  await page.goto(
    "https://onlinebusiness.icbc.com/webdeas-ui/login;type=driver",
  );
  // login
  await page.type("#mat-input-0", lastName);
  await page.type("#mat-input-1", licenseNumber);
  await page.type("#mat-input-2", passPhrase);
  await page.waitForSelector("#mat-checkbox-1-input");
  await page.evaluate(() => {
    document.querySelector("#mat-checkbox-1-input").parentElement.click();
  });
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Space");
  await page.screenshot({ path: "before.png" });

  await page.waitForNavigation();

  // select reschedule appointmnet
  await page.waitForTimeout(1000);

  let buttons = await page.$$("button");

  await buttons[3].click();

  // yes on the confirmation screen
  await page.waitForTimeout(1000);
  buttons = await page.$$("button");
  await buttons[6].click();

  // type vancouver
  await page.type("#mat-input-3", "Vancouver, ");
  await page.waitForTimeout(2000);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(2000);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1000);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1000);

  await page.waitForSelector(".right-arrow");
  const links = await page.$$(".right-arrow");
  await page.waitForTimeout(2000);
  console.log(links);
  const indices = [0, 1, 2, 3, 4];

  let count = 1;
  while (true) {
    // if (count % 350 == 0) {
    //   return;
    // }
    console.log(`trial: ${count}`);
    count++;
    for (let i = 0; i < 5; i++) {
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
