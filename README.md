# Road test registration bot

## What is this script?

The script scrapes the ICBC driving license office's website and sends en SMS message when a next appointment for a road test is available.

## Requirements

- `Node.js >= 12.14.1`
- Free Twilio account and the API key

## Usage

- Run the following commands in your terminal
  1. `git clone https://github.com/sawamotokai/road-test-registration-bot.git` to download the code.
  2. `cd road-test-registration-bot` to move into the directory.
  3. `npm install` to install dependancies.
  4. `touch .env` to configure environmental variables.
- Configure environmental variables. All in the list are necessary.
  | Variable Name | Description | Example |
  |--------------------|--------------------------------------------------------------------------------------------------------------------------------|---------------------------------|
  | TWILIO_ACCOUNT_SID | Twilio account id. Find it from your Twilio dashboard. | AC1981xxxxxxxxxxxxxxxxxxxxxxf48 |
  | TWILIO_AUTH_TOKEN | API key to Twilio. Create one from the dashboard. | 0cf1xxxxxxxxxxxxxxxxxx0fdd |
  | PHONE_NUMBER | The phone number you want to send SMS messages to. Starting from +{country code} | +12501234567 |
  | TWILIO_NUMBER | Your Twilio number you want to send SMS messages from. Create one for free from the dashboard. Starting from +{country code} | +9876543210 |
  | LAST_NAME | Your capitalized last name on your driver's license. | Smith |
  | LICENSE_NUMBER | Your license number. | 1234567 |
  | PASS_PHRASE | Your key word you registered for your license. | Word |
  | NOW_APPO | Your current latest appointment. Only appointments before this date will be notified. | 2021-08-15 |
- ### Run the starting command `node index.js`

## Tech stack

- ### Node.js
  - Puppeteer
  - SendGrid/mail
  - dotenv
