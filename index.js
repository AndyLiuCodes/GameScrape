// index.js

const express = require("express");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const port = process.env.PORT || "8000";

app.get("/", (req, res) => {
    res.status(200).send("Hello world");
    console.log("Hello World");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


async function fetchHTML(url){
    try {
        const { data } = await axios.get(url);

        return cheerio.load(data);
    }
    catch{
        console.log(`ERROR: An error occured when fetching URL ${url}`)
    }
}

app.get("/hi", async (req, res) => {
    const html = await fetchHTML("https://example.com");
    console.log(`${html('h1')}`)
    // console.log($);
    // console.log("-------------------")
    // // console.log(`Site HTML: ${$.html()} \n\n`);
    // console.log(`first h1 tag: ${$('h1').text()}`);
    // we can use $('css selector')
    // const pText=$('.blessMe').text()
    //=> HI
    // res.send(pText);
    res.send(`${html('h1')}`)
});