const express =  require('express');
const bodyParser = require("body-parser");
const path = require('path');
const request = require('request');

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

app.post('/api/checkURL', function(req, res) {
    
    const { baseURL } = req.body;
    console.log('RRRRRR', baseURL);
    request.head(baseURL, function(error, response) {
      if (!!response && response.statusCode === 200) {
        res.send({isValidURL: true});
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