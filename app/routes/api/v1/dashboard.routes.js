module.exports = (app) => {
  //controllers
  const controller = require("../../../controllers/dashboard.controller.js");

  var router = require("express").Router();

  // Retrieve all controller
  router.get("/", controller.findAll);

  app.use("/api/v1/dashboard", router);
};
