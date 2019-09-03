const cors = require('cors')
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const httpLogger = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
require('./helpers/load-env');

const userRoute = require('./routes/routeUser');

const app = express();
app.use(httpLogger('dev'));
app.use(bodyParser.json({
    verify(req, res, buf) {
        req.rawBody = buf;
    }
}));

app.use(session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
}))

app.use(bodyParser.json({limit: process.env.LIMIT_UPLOAD}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
require('./config/passport');
app.use(cors())
app.use('/api', require('./routes'));

const appSocket = require('express')();
const http = require('http').createServer(appSocket);

http.listen(process.env.WS_PORT, function () {
    console.log('listening on ' + process.env.WS_PORT);
});

const io = require('socket.io')(http);
io.on('connection', function (socket) {
    socket.emit('data', {'msg': 'hello'})
});

app.post('/api/run', function (req, res, next) {
    const {CampaignModel} = require('core-model');
    const {crawler} = require('./crawler')
    CampaignModel.findById(req.body.campaign_id)
        .then(function (campaign) {
            if (!campaign) {
                return res.sendStatus(404);
            }
            let crl = campaign.crawlers.id(req.body.id)
            crawler(crl, campaign, io, req.body.isTest).then(() => {
            })
            return res.sendStatus(200);
        }).catch(next);
})

app.get('/api/reset-user', async function (req, res, next) {
    const {UserModel} = require('core-model');
    await UserModel.deleteMany()
    return res.json({msg: "OK"})

})

module.exports = app;
