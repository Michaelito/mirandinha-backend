module.exports = (app) => {
  //controllers

  const controller = require("../../../controllers/produtos.controller.js");
  const auth = require("./../../../middleware/auth.js");

  var router = require("express").Router();

  // Retrieve all controller

  router.get("/all", auth.authenticateToken, controller.findAllERP);

  router.get("/search/:search", auth.authenticateToken, controller.findAll);

  router.get("/group/:id", auth.authenticateToken, controller.findAllGroup);

  router.get("/subgroup/:id_grupo/:id", auth.authenticateToken, controller.findAllSubGroup);

  router.get("/:id", auth.authenticateToken, controller.findOne);

  router.put("/:id", auth.authenticateToken, controller.update);

  app.use("/api/v1/products", router);
};
