const { readFileSync, writeFileSync } = require('fs');
const path = require('path');
const express = require('express');
const app = express();

// app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/index.html'));
});

app.get('/chess.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/chess.html'));
});

app.listen(5000, () => console.log('http://localhost:5000/'));
