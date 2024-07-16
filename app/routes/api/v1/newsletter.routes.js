module.exports = (app) => {
  //controllers
  const controller = require("../../../controllers/newsletter.controller.js");

  var router = require("express").Router();

  // Create a new Data
  router.post("/", controller.create);

  // Retrieve all controller
  router.get("/", controller.findAll);

  // Retrieve a single Data with id
  router.get("/:id", controller.findOne);

  app.use("/api/v1/newsletter", router);
};
