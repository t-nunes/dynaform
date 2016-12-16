"use strict";
const  fs    = require('fs'),
        http = require("http"),
        express = require("express"),
        app = express();

app.listen('3030', () => {
  app.use(express.static('app'));
})

app.post('/endpoint', (req,res) => {
    res.send(true)
})