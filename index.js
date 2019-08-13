var express = require('express');
const config = require('./config')
var bodyParser = require('body-parser');
var app = express();

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))


const arr = ['1','2','3'];


app.get('/', function (req, res) { res.render('index', {arr:arr})});
app.get('/create', function (req, res) { res.render('create') });
app.post('/create', (req, res) => {
    arr.push(req.body.text)
    res.redirect('/');
});

app.listen(config.PORT, function () {
  console.log(`Example app listening on port ${config.PORT}`);
});