const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const uri = "mongodb+srv://shrane:securepassword@cluster0-hp5sa.mongodb.net/test?retryWrites=true&w=majority";

var mongoOptions = {
    keepAlive: 1,
    connectTimeoutMS: 30000,
    reconnectTries: 30,
    reconnectInterval: 5000
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

objectsToInsert = [];
objectsToInsert.push({ test: "1" }, { test: "2" });
client.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db("denzel");

    data = [];

    insertDocuments(db, data, function () {
        client.close();
    });
});