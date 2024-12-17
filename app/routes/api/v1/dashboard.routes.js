module.exports = (app) => {
  //controllers
  const controller = require("../../../controllers/dashboard.controller.js");
  const auth = require("./../../../middleware/auth.js");

  var router = require("express").Router();

  // Retrieve a single data with id
  router.get("/", auth.authenticateToken, controller.findOne);

  app.use("/api/v1/dashboard", router);
};
