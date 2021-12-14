const tuneBot = require('./tuneBot');

var bot = new tuneBot();
(async () => {
    await bot.init('wyre', '75V4ClJZME4');
    await bot.run();
})();