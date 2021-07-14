const puppeteer = require("puppeteer");

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
  await page.type("#mat-input-3", "Vancouver, BC");
  await page.waitForTimeout(2000);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(2000);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1000);

  // await browser.close();
  while (true) {
    // TODO: click and check for the next availablitity
    // TODO: if found a earlier date, send an email to my self.
  }
  await page.screenshot({ path: "screenshot.png" });
})();
