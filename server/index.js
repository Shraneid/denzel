const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const { PORT } = require('./constants');

const populateMovies = require("./imdb");
const fetch = require("./fetcher")

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({ 'ack': true });
});

app.get("/movies/populate/:id", async (request, response) => {
  const id = request.params.id || nm0000243;
  try {
    const populateResponse = await populateMovies(id)
    response.send({ total: populateResponse.length });
  } catch (e) {
    response.status(404).send({ error: e.message });
  }
});

app.get("/movies", async (request, response) => {
  try {
    const populateResponse = await populateMovies(id)
    response.send({ total: populateResponse.length });
  } catch (e) {
    response.status(404).send({ error: e.message });
  }
});

app.get("/movies/:id", async (request, response) => {
  const id = request.params.id;
  try {
    const movie = await fetchMovie(id);
    response.send(movie);
  } catch (e) {
    response.status(404).send({ error: e.message });
  }
});

app.post("/movies/:id", async (request, response) => {
  const id = request.params.id;

});

app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);

module.exports = app;
