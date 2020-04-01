const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const { PORT } = require('./constants');
const bodyParser = require('body-parser');

const populateMovies = require("./imdb");
const fetch = require("./fetcher")

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());
app.use(express.json());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({ 'ack': true });
});

//1ST ENDPOINT
app.get("/movies/populate/:id", async (request, response) => {
  console.log("populating");
  const id = request.params.id || nm0000243;
  try {
    const populateResponse = await populateMovies(id);
    console.log(populateResponse);

    fetch.insert(populateResponse, "movie");

    response.send({ total: populateResponse.length });
  } catch (e) {
    response.status(404).send({ error: e.message });
  }
});

//2ND ENDPOINT
app.get("/movies", async (request, response) => {
  try {
    const movie = await fetch.fetchMovie();
    response.send({ movie: movie });
  } catch (e) {
    response.status(404).send({ error: e.message });
  }
});

//4th ENDPOINT
app.get("/movies/search", async (request, response) => {
  let limit = parseInt(request.query.limit || 5);
  let metascore = parseInt(request.query.metascore || 0);
  try {
    const movie = await fetch.fetchMovieFromSearch(limit, metascore);
    console.log(movie);
    response.send(movie);
  } catch (e) {
    response.status(404).send({ error: e.message });
  }
});

//3RD ENDPOINT
app.get("/movies/:id", async (request, response) => {
  const id = request.params.id;
  try {
    const movie = await fetch.fetchMovieFromId(id);
    response.send(movie);
  } catch (e) {
    response.status(404).send({ error: e.message });
  }
});

//5TH ENDPOINT
app.post("/movies/:id", async (request, response) => {
  const id = request.params.id;
  console.log("body = " + JSON.stringify(request.body));
  const { date, review } = request.body;
  try {
    const reviewRes = await fetch.uploadReview(id, date, review);
    response.send(reviewRes);
  } catch (e) {
    response.status(404).send({ error: e.message });
  }
});

app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);

module.exports = app;
