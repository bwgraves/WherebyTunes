const playwright = require('playwright');

class tuneBot {
    async init(roomName){

        if (!roomName){
            throw 'please specify the room name.';
        }

        this.roomName = roomName;
        this.browser = await playwright.chromium.launch(
        { 
            headless: false,
            args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--use-file-for-fake-audio-capture=song.wav', '--no-sandbox', '--enable-logging --v=1'],
        });
    }

    async run() {
        if (!this.browser){
            throw 'browser hasn\'t been initialised.';
        }
        const page = await this.browser.newPage();
        await page.goto(`https://whereby.com/${this.roomName}`);
        await page.waitForSelector('input[name="nickname"]');
        await page.fill('input[name="nickname"]', 'bot');
        await page.click('.jstest-nameprompt-continue');
        await page.waitForSelector('.jstest-join-room-button');
        await page.click('.jstest-join-room-button');
        await page.waitForTimeout(30000); // In reality should be the length of the given song
        await this.browser.close();
    }

}

module.exports = tuneBot;