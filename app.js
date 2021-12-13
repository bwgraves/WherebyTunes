const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const tuneBot = require('./tuneBot');
var cors = require('cors')

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors())

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static('public'))
app.use(bodyParser.json());

var bot = new tuneBot();

app.get('/', (req, res) => {
    res.render('index');
})

app.post('/play', (req, res) => {
    const roomName = req.body.roomName;
    const tuneId = req.body.tuneId;

    console.log(JSON.stringify(req.body));

    console.log(roomName);

    (async () => {
        await bot.init(roomName, tuneId);
        await bot.run();
    })();
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});