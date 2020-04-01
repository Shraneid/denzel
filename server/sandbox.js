/* eslint-disable no-console, no-process-exit */
const imdb = require('./imdb');
const DENZEL_IMDB_ID = 'nm0000243';
const METASCORE = 77;
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://shrane:<testpwd>@cluster0-hp5sa.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let movies = null;
let promises = [];

async function uploadData(tableName, objectsToInsert) {
    console.log("connecting");
    return new Promise((resolve, reject) => {
        client.connect(err => {
            if (err) reject(err);
            const collection = client.db("denzel").collection("movies");

            collection.drop();

            collection.insertMany(objectsToInsert, (err, res) => {
                if (err) reject(err);
            });

            console.log("worked");
            client.close();
            resolve();
        });
    });
}

async function begin(actor = DENZEL_IMDB_ID, metascore = METASCORE) {
    movies = await start(actor, metascore);
    promises.push(movies);
    console.log(movies.allmovies.length);
    console.log(movies.awesome.length);

    process.exit(0);
}

async function start(actor = DENZEL_IMDB_ID, metascore = METASCORE) {
    let allmovies = null;
    let awesome = null;
    try {
        console.log(`📽️  fetching filmography of ${actor}...`);
        allmovies = await imdb(actor);
        awesome = allmovies.filter(movie => movie.metascore >= metascore);

        /*console.log(`🍿 ${movies.length} movies found.`);
        console.log(JSON.stringify(movies, null, 2));
        console.log(`🥇 ${awesome.length} awesome movies found.`);
        console.log(JSON.stringify(awesome, null, 2));
        */
        promises.push(await uploadData("movies", allmovies));
        promises.push(await uploadData("awesome", awesome));
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
    return { allmovies, awesome }
}

const [, , id, metascore] = process.argv;

begin(id, metascore);

