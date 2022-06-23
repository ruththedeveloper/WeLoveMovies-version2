const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

////// middleware

async function paramExists(req, res, next) {
  const { movieId } = req.params;
  const paramMatch = await service.read(Number(movieId));
  if (paramMatch.length === 0 || !movieId)
    return next({
      status: 404,
      message: `movieId: ${movieId} does not exist in the database`,
    });
  res.locals.movie = paramMatch[0];
  next();
}

/// ///// list function  and is_showing
async function list(req, res) {
  const { is_showing } = req.query;
  const data = is_showing
    ? await  (await service.listIsShowing()).slice(0, 15)
    : await service.list();
  res.status(200).json({ data: data });
}

///// read function

async function read(req, res) {
  res.status(200).json({ data: res.locals.movie });
};

async function listReviews(req,res){
   const  movieId = res.locals.movie.movie_id;
   const reviews = await service.listReviews(movieId);

    const allReviews = [];
     for ( let i=0 ; i < reviews.length; i++){
       const review = reviews[i];
       const critic = await service.getCritics(review.critic_id);
       review.critic  = critic[0];
       allReviews.push(review);
     }
     res.status(200).json({data:allReviews});

}







//// list Theaters
async function listTheaters(req, res) {
  const movieId = res.locals.movie.movie_id;
  const results = await service.listTheaters(movieId);
  res.status(200).json({ data: results });
};



module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(paramExists), asyncErrorBoundary(read)],
  listTheaters: [
    asyncErrorBoundary(paramExists),
    asyncErrorBoundary(listTheaters),
  ],
  listReviews:[asyncErrorBoundary(paramExists),asyncErrorBoundary(listReviews)]
};
