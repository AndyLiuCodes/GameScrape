const GameScrape = require('./GameScrape');
const Pool = require('../db/connection');

var UpdateDB = async () => {
    console.log("Updating gamestorage database!")
    //Remove all data - to remove any expired deals
    Pool.query("truncate table gamestorage");

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

    console.log("Database update complete!")
}

module.exports = {
    updateDB: UpdateDB
}