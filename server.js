const { readFileSync, writeFileSync } = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(5000, () => console.log('http://localhost:5000/'));
