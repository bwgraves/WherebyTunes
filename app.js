const tuneBot = require('./tuneBot');

var bot = new tuneBot();

(async () => {
    await bot.init('wyre');
    await bot.run();
})();