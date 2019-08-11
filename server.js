const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const request = require('request');
const cryptoRandomString = require('crypto-random-string');
const { Pool } = require('pg');
let db
if (!!process.env.DATABASE_URL) {
    db = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: true
    });
} else {
    db = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'shorturl',
        password: 'Zydfhm2013',
        port: 5432,
    })
}

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

app.get('/db', async (req, res) => {
    try {
        const client = await db.connect();
        const result = await client.query('SELECT * FROM urls');
        const results = { 'results': (result) ? result.rows : null };
        console.log('rows', result.rows);
        res.send({ data: results });
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
})

app.get('/x/:shorten', (req, res) => {
    console.log('XXXXXXXXXXx', req.params['shorten']);
    res.redirect(301, 'https://snatchbot.me');
});
app.post('/api/checkURL', (req, res) => {
    const { base } = req.body;
    console.log('base', base);
    request.head(base, (error, response) => {
        if (!!response && response.statusCode === 200) {
            res.send({ data: true });
        } else {
            res.send({ data: false });
        }
    });
});
app.post('/api/shortenURL', async (req, res) => {
    let error;
    let shortenURL;
    let status;
    //const client = pool.connect();
    const { baseURL, customURL } = req.body;
    console.log('RRRRRR', baseURL);
    if (!!customURL) {
        custom = encodeURI(customURL);
        console.log('custom', custom);
        try {
            const client = await db.connect();
            const result = await client.query('SELECT id FROM urls WHERE custom = $1', [custom]);
            if (!!result && result.rows.length > 0) {
                res.send({
                status: false,
                shortenURL: '',
                error: 'Custom url is already exists',
                });
            } else {
                const result = await client.query('INSERT INTO urls (base, custom, shorten, createdAt, updatedAt) VALUES ($1, $2, $2, NOW(), NOW())', [baseURL, custom]);
                res.send({
                    status: true,
                    shortenURL: custom,
                    error: null,
                    });
            }
            client.release();
        } catch {
            console.error(err);
            res.send({error: 'Error custom'});
        }

    } else {
        hash = cryptoRandomString({ length: 10, type: 'url-safe' });
        console.log('baseHash', hash);
    }
});
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/urlShort/index.html'));
});

app.listen(process.env.PORT || 8080);