const playwright = require('playwright');

async function run(){
    const browser = await playwright.chromium.launch(
    { 
        headless: false,
        args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--use-file-for-fake-audio-capture=song.wav', '--no-sandbox', '--enable-logging --v=1'],
    });
    const page = await browser.newPage();
    await page.goto('https://whereby.com/wyre');
    await page.waitForSelector('input[name="nickname"]');
    await page.fill('input[name="nickname"]', 'bot');
    await page.click('.jstest-nameprompt-continue');
    await page.waitForSelector('.jstest-join-room-button');
    await page.click('.jstest-join-room-button');
    await page.screenshot({path: 'screenshot.png'});
    // await page.waitForTimeout(10000);
     // browser.close();
}

run();