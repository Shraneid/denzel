const { MONGO_URI } = require('./constants');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const uri = "mongodb+srv://shrane:securepassword@cluster0-hp5sa.mongodb.net/test?retryWrites=true&w=majority";

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

var mongoOptions = {

}
const client = new MongoClient(uri, mongoOptions);

const insertDocuments = function (db, dataToInsert, collectionName, callback) {
    const collection = db.collection(collectionName);
    collection.insertMany(dataToInsert, function (err, result) {
        assert.equal(err, null);
        let str = "Inserted " + result.insertedCount + " documents into the collection"
        console.log(str);
        callback(result);
    });
}

const insert = function (dataToInsert, collectionName) {
    client.connect(function (err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db("denzel");

        insertDocuments(db, dataToInsert, collectionName, function () {
            client.close();
        });
    });
}


const fetchMovie = () => {
    return new Promise((resolve, reject) => {
        client.connect(err => {
            if (err) return reject({ message: err });
            const collection = client.db("denzel").collection("movie");
            try {
                movies = []
                collection.find({ metascore: { $gte: 70 } }).toArray(function (err, docs) {
                    assert.equal(err, null);
                    movies = docs;
                    if (movies.length >= 1) {
                        resolve(movies[getRandomInt(movies.length)]);
                    }
                    else resolve(null);
                });
            } catch (e) {
                reject({ message: e });
            }
        });
    });
};

const fetchMovieFromId = movieId => {
    return new Promise((resolve, reject) => {
        client.connect(err => {
            if (err) return reject({ message: err });
            const collection = client.db("denzel").collection("movie");
            try {
                movies = []
                collection.find({ id: movieId }).toArray(function (err, docs) {
                    assert.equal(err, null);
                    movies = docs;
                    if (movies.length >= 1) {
                        resolve(movies[getRandomInt(movies.length)]);
                    }
                    else resolve(null);
                });
            } catch (e) {
                reject({ message: e });
            }
        });
    });
};

const fetchMovieFromSearch = (limit, metascore) => {
    return new Promise((resolve, reject) => {
        client.connect(err => {
            if (err) return reject({ message: err });
            const collection = client.db("denzel").collection("movie");
            try {
                collection.find({ metascore: { $gte: metascore } })
                    .limit(limit)
                    .sort({ metascore: -1 })
                    .toArray(function (err, movies) {
                        assert.equal(err, null);
                        resolve(movies);
                    });
            } catch (e) {
                reject({ message: e });
            }
        });
    });
};

const uploadReview = (id, date, review) => {
    client.connect(function (err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db("denzel");

        console.log("date = " + date);
        console.log("review = " + review);

        let dataToInsert = [{ id, date, review }];

        insertDocuments(db, dataToInsert, "reviews", function () {
            client.close();
        });
    });
};

module.exports = {
    insertDocuments,
    insert,
    fetchMovie,
    fetchMovieFromId,
    fetchMovieFromSearch,
    uploadReview
};
