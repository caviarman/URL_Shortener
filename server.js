const express =  require('express');
const path = require('path');

const app = express();
app.use(express.static('./dist/urlShort'));

app.get('/api/hello', function(req, res) {
    res.send('<h1>Hello World</h1>');
});
app.get('/*', function(req, res) {
    res.sendFile(path.join('./dist/urlShort/index.html'));
});

app.listen(process.env.PORT || 8080);