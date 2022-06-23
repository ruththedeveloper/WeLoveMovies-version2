const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function paramsCheck(req, res, next) {
  const { reviewId } = req.params;
  const review = await service.read(reviewId);
  
  if (review.length === 0 || !reviewId)
    return next({ status: 404, message: "Review cannot be found." });
  res.locals.review = review[0];
  next();
}

function hasValidProperty(req, res, next) {
  const { data: { score = null, content = null } = {} } = req.body;
  let updateObj = {};
  if (!score && !content)
    return next({ status: 400, message: "Missing score or content in body " });
  if (score) updateObj.score = score;
  if (content) updateObj.content = content;
  res.locals.update = updateObj;
  next();
}

async function list(req, res) {
  const reviews = await service.list();
  res.status(200).json({ data: reviews });
}

 function read(req, res) {
  res.status(200).json({ data: res.locals.review });
}

async function update(req, res) {
  const { critic_id, review_id } = res.locals.review;
  const update = res.locals.update;
  await service.update(update, review_id);
  const updatedReview = await service.read(review_id);
  const critic = await service.getCritic(critic_id);
  res.status(200).json({ data: { ...updatedReview[0], critic: critic[0] } });
}

async function destroy(req, res) {
  const {review_id} = res.locals.review;
  await service.destroy(review_id);
  res.sendStatus(204);
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(paramsCheck), read],
  update: [
    asyncErrorBoundary(paramsCheck),
    hasValidProperty,
    asyncErrorBoundary(update),
  ],
  destroy: [asyncErrorBoundary(paramsCheck), asyncErrorBoundary(destroy)],
};
