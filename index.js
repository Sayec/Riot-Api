const { request } = require('express');
const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening at ${port}`);
});
app.use(express.static('public'));
app.use(express.json());
require('dotenv').config();
console.log(process.env);
const database = new Datastore('database.db');
database.loadDatabase();
const riot_api = process.env.API_KEY;
app.post('/api', (request, response) => {
  console.log(request.body);
  const timestamp = Date.now();
  const data = request.body;
  data.timestamp = timestamp;
  database.insert(data);
  data.name = 'testowenoweimie';
  // console.log(database);
  response.json(data);
});

app.get('/userName/:userName', (request, response) => {
  console.log(request.params);
  console.log(request.query);
  // const timestamp = Date.now();
  const data = request.body;
  // data.timestamp = timestamp;
  // database.insert(data);
  // data.name = 'testowenoweimie';
  // console.log(database);
  response.json(data);
});

app.get('/getAPI', (request, response) => {
  response.json(`${process.env.API_KEY}`);
});

app.get('/summonerName/:name', async (request, response) => {
  const name = request.params.name;
  const fetch_response = await fetch(
    `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${riot_api}`
  );
  const data = await fetch_response.json();
  response.json(data);
});

app.get('/summonerRank/:id', async (request, response) => {
  const id = request.params.id;
  const fetch_response = await fetch(
    `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${riot_api}`
  );
  const data = await fetch_response.json();
  response.json(data);
});

app.get('/playerMatch/:puuid', async (request, response) => {
  const puuid = request.params.puuid;
  const fetch_response = await fetch(
    `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${riot_api}`
  );
  const data = await fetch_response.json();
  response.json(data);
});
app.get('/matchParti/:matchId', async (request, response) => {
  const matchId = request.params.matchId;
  const fetch_response = await fetch(
    `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${riot_api}`
  );
  const data = await fetch_response.json();
  response.json(data);
});
