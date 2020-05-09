const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');

const games = require('./routes/api/db');

const UpdateDB = require('./Scripts/UpdateDB');

const app = express((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ a: 1 }, null, 3));
});

const port = process.env.PORT || "8000";

app.use(bodyParser.json());

//Routes
app.use('/api/', games);


app.get("/", (req, res) => {
    //Get website available for the day
    res.status(200).send("Hello world");
    console.log("Hello World");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

//Only update database in production
if (process.env.NODE_ENV == 'production') {
    //Initial database load on server
    UpdateDB.updateDB();

    //Update Every 12hrs
    setInterval(UpdateDB.updateDB, 1000 * 60 * 60 * 12); // sec -> mins -> hrs
}