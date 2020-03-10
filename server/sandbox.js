/* eslint-disable no-console, no-process-exit */
const imdb = require('./imdb');
const DENZEL_IMDB_ID = 'nm0000243';
const METASCORE = 77;
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://shrane:<Kunetin_1998>@cluster0-hp5sa.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

async function uploadData(tableName, objectsToInsert) {
    client.connect(err => {
        const collection = client.db("denzel").collection(tableName);

        collection.drop();

        //let r = await collection.insertMany(objectsToInsert);

        console.log("worked");
        client.close();
    });
}

async function begin(actor = DENZEL_IMDB_ID, metascore = METASCORE) {
    await start(actor, metascore);

    process.exit(0);
}

async function start(actor = DENZEL_IMDB_ID, metascore = METASCORE) {
    try {
        console.log(`📽️  fetching filmography of ${actor}...`);
        const movies = await imdb(actor);
        const awesome = movies.filter(movie => movie.metascore >= metascore);

        console.log(`🍿 ${movies.length} movies found.`);
        console.log(JSON.stringify(movies, null, 2));
        console.log(`🥇 ${awesome.length} awesome movies found.`);
        console.log(JSON.stringify(awesome, null, 2));

        await uploadData("movies", movies);
        await uploadData("awesome", awesome);

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

const [, , id, metascore] = process.argv;

begin(id, metascore);