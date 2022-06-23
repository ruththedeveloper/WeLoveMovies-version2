const router = require("express").Router();

const defaultRoute = (req, res) =>
  res.status(200).json("We love movies project");

router.route("/").get([defaultRoute]);

module.exports = router;
