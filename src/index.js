//Get Dependencies
const express = require('express');
const app = express();

const path = require('path');
const http = require('http');
var bodyParser = require('body-parser');
const mongoose = require('./database');
//const fileUpload = require('express-fileupload');

const passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
require('./authpassport')(passport); // pass passport for  configuration
require('./passport')(passport);

// Get our API routes
const usersApi = require('./routes');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//required for passport
app.use(session({
    secret: 'botnyuserdetails', // session secret
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Expose-Headers", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,Authorization');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

app.use('/google/authentication', usersApi);
require('./authRoutes.js')(app, passport);

app.use(express.static('./public'));
app.use('/', express.static(__dirname + '/'));
const port = process.env.PORT || '3001';
app.set('port', port);
const server = http.createServer(app);

server.listen(port, () => console.log(`API running on localhost:${port}`));
