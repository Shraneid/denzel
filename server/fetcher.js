const { MONGO_URI } = require('./constants');

const fetchMovie = id => {
    const client = new MongoClient(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    return new Promise((resolve, reject) => {
        client.connect(async err => {
            if (err) return reject({ message: err });
            const collection = client.db("denzel").collection(id);
            try {
                const movie = await collection.findOne({ id });
                if (movie) resolve(movie);
                else resolve(null);
            } catch (e) {
                reject({ message: e });
            }
        });
    });
};