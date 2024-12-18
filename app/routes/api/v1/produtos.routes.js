module.exports = (app) => {
  //controllers

  const controller = require("../../../controllers/produtos.controller.js");
  const auth = require("./../../../middleware/auth.js");

  var router = require("express").Router();

  // Retrieve all controller
  router.get("/:search", auth.authenticateToken, controller.findAll);

  // Retrieve all controller
  router.get("/group/:id", auth.authenticateToken, controller.findAllGroup);

  router.get("/subgroup/:id", auth.authenticateToken, controller.findAllSubGroup);

  // Retrieve a single Data with id
  router.get("/:id", auth.authenticateToken, controller.findOne);

  // Update a Data with id
  router.put("/:id", auth.authenticateToken, controller.update);

  app.use("/api/v1/products", router);
};
