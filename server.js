const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet')
const cors = require('cors')
const STORE = require('./movieData.json')
require('dotenv').config()


const app = express();

app.use(helmet())
app.use(cors())
app.use(morgan('dev'));

function handleAuth (req, res, next) {
  const userAuth = req.get('Authorization')
  if(!userAuth) res.status(401).json({ error: 'unauthorized' })
  if(!userAuth.includes("Bearer")) res.status(401).json({ error: 'unauthorized' })
  if(userAuth.split(' ')[1] !== process.env.API_KEY) res.status(401).json({ error: 'forbidden' })
  next()
}

function filterMovies(array, str1, str2){
  return array.filter(x => x[str1].toLowerCase().includes(str2.toLowerCase()))
}

function handleQuery (req, res, next) {
  let movies = STORE
  const { genre, country, avg_vote } = req.query
  if(genre) {
    movies = filterMovies(movies, 'genre', genre)
  }
  if(country) {
    movies = filterMovies(movies, 'country', country)
  }
  if(avg_vote) {
    movies = movies.filter(x => x['avg_vote'] >= Number(avg_vote))
  }
  res.send(movies)
}

app.get('/movie', handleAuth, handleQuery)

app.listen(8000, () => {
  console.log('running')
})

