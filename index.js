const puppeteer = require("puppeteer");
const moment = require("moment");
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

(async () => {
  const width = 1024;
  const height = 1600;
  const browser = await puppeteer.launch({
    defaultViewport: { width: width, height: height },
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(
    "https://onlinebusiness.icbc.com/webdeas-ui/login;type=driver"
  );
  // login
  await page.type("#mat-input-0", "Sawamoto");
  await page.type("#mat-input-1", "3265393");
  await page.type("#mat-input-2", "Atom");
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
  await page.type("#mat-input-3", "Vancouver");
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

  while (true) {
    for (let i = 0; i < 3; i++) {
      await links[indices[i]].click();
      await page.waitForTimeout(1000);
      let date = await page.$$(".date-title");
      date = date[0];
      if (!date) continue;
      const dateText = await date.evaluate((node) => node.innerText);
      console.log(dateText);
      const nowAppo = moment("2021-11-08");
      const nextAppo = moment(dateText, "dddd, MMMM Do, YYYY");
      if (nowAppo > nextAppo) {
        console.log("earlier appointment was found");
        const message = await client.messages.create({
          body: "New appointmnet was found!",
          from: "+19493862391",
          to: "+16729996944",
        });
        console.log(message.sid);
        await browser.close();
        process.exit(0);
      }
    }
  }
})();

client.messages
  .create({
    body: "This is the ship that made the Kessel Run in fourteen parsecs?",
    from: "+15017122661",
    to: "+15558675310",
  })
  .then((message) => console.log(message.sid));
