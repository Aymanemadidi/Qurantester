const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../client'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/../client/index.html'));
});

app.get('/sura', function(req, res) {
    res.sendFile(path.join(__dirname + '/../client/sura.html'));
});

app.get('/hizb', function(req, res) {
    res.sendFile(path.join(__dirname + '/../client/hizb.html'));
});

app.get('/juz2', function(req, res) {
    res.sendFile(path.join(__dirname + '/../client/juz2.html'));
});

app.get('/api/sura/:id', (req, res)=>{
    const url = "https://api.alquran.cloud/v1/surah/" + req.params.id;
    fetch(url)
    .then(response => response.json())
    .then(json => {
        res.json(json);
    });
});

app.get('/api/juz/:id', (req, res)=>{
    const url = `https://api.alquran.cloud/v1/juz/${req.params.id}/quran-uthmani`;
    fetch(url)
    .then(response => response.json())
    .then(json => {
        res.json(json);
    });
});

app.get('/api/quarter/:id', (req, res)=>{
    const url = `https://api.alquran.cloud/v1/hizbQuarter/${req.params.id}/quran-uthmani `;
    fetch(url)
    .then(response => response.json())
    .then(json => {
        res.json(json);
    });
});

function notFound(req, res, next){
    res.status(400);
    const error = new Error("Not Found");
    next(error);
}

function errorHandler(error, req, res, next){
    res.status(res.statusCode || 500);
    res.json({
        message: error.message
    });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, ()=>{
    console.log("Quran app listening on port", port);
})