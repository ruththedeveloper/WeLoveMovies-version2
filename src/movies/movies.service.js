const db = require("../db/connection");

// - `GET /movies`
function list() {
  return db("movies");
}

// get the movies that is showing is set to true

function listIsShowing() {
  return db("movies as m")
    .join("movies_theaters as mt", "mt.movie_id", "m.movie_id")
    .where({ "mt.is_showing": true });
}

//// Get movie by Id
function read(movieId) {
  return db("movies").select("*").where({ movie_id: movieId });
}

//### GET /movies/:movieId/critics

function getCritics(criticId) {
  return db("critics").where({ critic_id: criticId });
}

//### GET /movies/:movieId/reviews

function listReviews(movieId) {
  return db("movies as m")
    .join("reviews as r", "m.movie_id","r.movie_id")
    .where({ "m.movie_id":movieId });
};

//### GET /movies/:movieId/theaters

function listTheaters(movieId) {
  return db("movies as m")
    .join("movies_theaters as mt", "mt.movie_id", "m.movie_id")
    .join("theaters as t", "t.theater_id", "mt.theater_id")
    .select("t.*", "m.movie_id")
    .where({ "m.movie_id": movieId });
};




module.exports = {
  list,
  listIsShowing,
  read,
  getCritics,
  listReviews,
  listTheaters,
};
