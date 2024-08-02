module.exports = (app) => {
  //controllers

  const controller = require("../../../controllers/produtos.controller.js");

  var router = require("express").Router();

  // Retrieve all controller
  router.get("/", controller.findAll);

  // Retrieve all controller
  router.get("/group/:id", controller.findAllGroup);

  // Retrieve a single Data with id
  router.get("/:id", controller.findOne);

  // Update a Data with id
  router.put("/:id", controller.update);

  app.use("/api/v1/produtos", router);
};
