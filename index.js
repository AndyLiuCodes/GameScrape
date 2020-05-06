// index.js

const express = require("express");
const path = require("path");
const GameScrape = require('./Scripts/GameScrape.js');

const app = express((req, res)=>{
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ a: 1 }, null, 3));
});
const port = process.env.PORT || "8000";

app.get("/", (req, res) => {
    res.status(200).send("Hello world");
    console.log("Hello World");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});



app.get("/hi", async (req, res) => {
    const results = await GameScrape.ScrapeSteam(2);
    // console.log(result)
    // res.send(JSON.stringify(result))

    res.send(JSON.stringify(results));

});