const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const tuneBot = require('./tuneBot');

const PORT = process.env.PORT || 5000;
const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: true
  }));

var bot = new tuneBot();

app.get('/', (req, res) => {
    res.render('index');
})

app.post('/play', (req, res) => {
    const roomName = req.body.roomName;
    (async () => {
        await bot.init(roomName);
        await bot.run();
    })();
    res.render('playing');
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});