const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const request = require('request');
const cryptoRandomString = require('crypto-random-string');
const { Pool } = require('pg');
const db = require('./utils/database');

const app = express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header(
        "Access-Control-Allow-Headers",
        "Content-type,Accept,x-access-token,X-Key"
    );
    if (req.method == "OPTIONS") {
        res.status(200).end();
    } else {
        next();
    }
});
app.use(bodyParser.json());
app.use(express.static(__dirname + '/dist/urlShort'));

app.get('/x/:shorten', async (req, res) => {
    const base = await db.getBaseByShorten(req.params['shorten']);
    if (base.length > 0) {
        res.redirect(301, base);
    }
});
app.post('/api/checkURL', (req, res) => {
    const { base } = req.body;
    request.head(base, (error, response) => {
        if (!!response && response.statusCode === 200) {
            res.send({ data: true });
        } else {
            res.send({ data: false });
        }
    });
});
app.post('/api/shortenURL', async (req, res) => {
    const { baseURL, customURL } = req.body;
    if (!!customURL) {
        custom = encodeURI(customURL);
            if (await db.isCustomExists(custom)) {
                res.send({
                    status: false,
                    shortenURL: '',
                    error: 'Custom url is already exists. Choose another one',
                    });
            } else {
                await db.saveCustom(baseURL, custom);
                res.send({
                    status: true,
                    shortenURL: custom,
                    error: null,
                    });
            }
        } else {
        shortStr = cryptoRandomString({ length: 10, type: 'url-safe' });
        await db.saveShorten(baseURL, shortStr);
        res.send({
            status: true,
            shortenURL: shortStr,
            error: null,
            });
    }
});
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/urlShort/index.html'));
});

app.listen(process.env.PORT || 8080);