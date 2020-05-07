// index.js

const express = require("express");
const path = require("path");
const GameScrape = require('./Scripts/GameScrape');
const Pool = require('./db/connection');

const app = express((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ a: 1 }, null, 3));
});
const port = process.env.PORT || "8000";

app.get("/", (req, res) => {
    //Get website available for the day
    res.status(200).send("Hello world");
    console.log("Hello World");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});



app.get("/hi", async (req, res) => {
    // const results = await GameScrape.ScrapeSteam(5);
    const results = await GameScrape.UpdateGameDatabase();

    for(let i = 0; i < results.length; i++){
        let game = results[i];

        let query = `insert into gamestorage values('${game.title}', '${game.imgURL}','${game.link}', '${game.platform}' ,${game.free},${game.discounted})`;

        Pool.query(query, (err, res) =>{
            if(err){
                console.log(err)
            }
        });
    }
    res.send(JSON.stringify(results));

});