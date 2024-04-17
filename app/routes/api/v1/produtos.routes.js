module.exports = (app) => {
  //controllers

  const controller = require("../../../controllers/produtos.controller.js");

  var router = require("express").Router();

  // Retrieve all controller
  router.get("/", controller.findAll);

  // Retrieve all controller
  router.get("/group/:id", controller.findAll);

  // Retrieve a single Tutorial with id
  router.get("/:id", controller.findOne);

  app.use("/api/v1/produtos", router);
};
