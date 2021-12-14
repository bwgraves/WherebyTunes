const playwright = require('playwright');
const youtubedl = require('youtube-dl-exec')
const { createWriteStream } = require("fs");
const ytdl = require('ytdl-core');
const path = require("path");
const spawn = require('child_process').spawn;
const ffmpeg = require('fluent-ffmpeg');

class tuneBot {
    async init(roomName, tuneId){

        if (!roomName){
            throw 'please specify the room name.';
        }

        if (!tuneId){
            throw 'please specify a tune id.'
        }

        // Download the wav (hate myself for doing it like this but there we go)
        await this.downloadTune(tuneId);

        //await new Promise(r => setTimeout(r, 5000));

        // convert to wav
        await this.convertToWav(`./songs/${tuneId}.mp3`);

        // await new Promise(r => setTimeout(r, 5000));

        this.roomName = roomName;

        this.browser = await playwright.chromium.launch(
        { 
            headless: true,
            args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', `--use-file-for-fake-audio-capture=./songs/${tuneId}.wav`, '--no-sandbox', '--enable-logging --v=1'],
        }).catch(err => {
            console.log(err.message)
        });
    }

    async downloadTune(tuneId){
        return new Promise((resolve, reject) => {
            console.log('starting download');
            ytdl(`https://www.youtube.com/watch?v=${tuneId}`, 
            {
                format: 'mp3'
            })
            .pipe(
                createWriteStream(
                    path.join(__dirname, "/songs", `${tuneId}.mp3`)
                )
            ).on("finish", function(){
                console.log('finished download');
                resolve();
            })
            .on("error", function(){
                reject();
            });
        });
    }

    async convertToWav(tunePath){
        return new Promise((resolve, reject) => {
            ffmpeg(tunePath)
                .toFormat('wav')
                .on('error', (err) => {
                    console.log('An error occurred: ' + err.message);
                    reject();
                })
                .on('end', () => {
                    resolve();
                })
                .save(tunePath.replace('mp3', 'wav'));
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
        // await this.browser.close();
    }

}

module.exports = tuneBot;