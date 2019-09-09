const cors = require('cors')
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const httpLogger = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
require('./helpers/load-env');
require('./models/User')
const app = express();

const whitelist = [
    'http://127.0.0.1',
    'http://localhost',
    'http://wwww.thefactwall.com',
    'https://wwww.thefactwall.com'
]

const corsOptions = {
    origin: function (origin, callback) {
        callback(null, true)
    }
}

app.use(cors(corsOptions))
app.use(httpLogger('dev'));
app.use(bodyParser.json({
    verify(req, res, buf) {
        req.rawBody = buf;
    }
}));

app.use(session({
    secret : "secret",
    saveUninitialized: false,
    resave: true, cookie: {maxAge: 60000}
}))

app.use(bodyParser.json({limit: process.env.LIMIT_UPLOAD}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
require('./config/passport');
app.use('/api', require('./routes'));

module.exports = app;
