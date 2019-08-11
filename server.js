const express =  require('express');
const bodyParser = require("body-parser");
const path = require('path');
const request = require('request');
const cryptoRandomString = require('crypto-random-string');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('shorten', 'postgres', '', {
  host: 'localhost',
  dialect: 'postgres'
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const app = express();
app.use(function(req, res, next) {
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

app.get('/x/:shorten', function(req, res) {
  console.log('XXXXXXXXXXx', req.params['shorten']);
  res.redirect(301, 'https://snatchbot.me');
});
app.post('/api/shortenURL', function(req, res) {
    const { baseURL, customURL } = req.body;
    console.log('RRRRRR', baseURL);
    request.head(baseURL, function(error, response) {
      if (!!response && response.statusCode === 200) {
        if (!!customURL) {
          hash = encodeURI(customURL)
          console.log('customHash', hash);
        } else {
          hash = cryptoRandomString({length: 10, type: 'url-safe'});
          console.log('baseHash', hash);
        } 
        res.send({
          isValidURL: true,
          shortenURL: hash
        });
      } else {
        res.send({isValidURL: false});
      }
    });
    console.log('send back'); 
    
});
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/urlShort/index.html'));
});

app.listen(process.env.PORT || 8080);