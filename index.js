const { request } = require('express');
const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
const app = express();
app.listen(3000, () => {
  console.log('Listening at 3000');
});
app.use(express.static('public'));
app.use(express.json());
require('dotenv').config();
console.log(process.env);
const database = new Datastore('database.db');
database.loadDatabase();

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
  console.log(process.env.API_KEY);
  response.json(`${process.env.API_KEY}`);
});
